const {SlashCommandBuilder,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ModalBuilder,TextInputBuilder} = require("discord.js");
const fs = require('fs'); 
const path = require('path');
require("dotenv/config");

module.exports = {
	async execute(interaction) {
		try {
			const content = interaction.options.getString('description');
			const needembed = interaction.options.getBoolean('need-embed');

			const modal = new ModalBuilder()
			.setCustomId('registration')
			.setTitle('Регистрация на ивент')
			.addComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
					.setCustomId('socialClub')
					.setLabel('Введи свой ник Social club')
					.setStyle(1)
					.setMaxLength(16)//Максимальная длина ника сошала
					//.setPlaceholder('') //Строчка на поле ввода
					.setRequired(true)
				)
			);

			const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setEmoji('1137125924173795368')
				.setLabel('Зарегистрироваться')
				.setCustomId('addmember')
				.setStyle(3),

				new ButtonBuilder()
				.setEmoji('1014257918536851597')
				.setLabel('Добавить ивентера в друзья')
				.setStyle(5)
				.setURL(`https://socialclub.rockstargames.com/member/`+
					`${interaction.options.getString('social-club-nickname')}`
				)
			);

			const embed = new EmbedBuilder()
			.setColor(0x9caef2)
			.setTitle('Очередной топовый ивент')
			.setDescription(content)
			.setFooter({text: `by .hanter.`});


			//Скип сообщенька, чтобы убрать ответ на interaction
			await interaction.reply({content: 'Отправляю...', ephemeral: true});

			const message = await interaction.channel.send({
				content: needembed ? '' : content,
				embeds: needembed ? [embed] : [],
				components: [row]
			});

			await interaction.deleteReply();

			//Счётчик зарегистрированных
			var registered = 0;

			//Директория папки и проверка её существованивания. Создаётся в папке с исполняемым файлом
			const folderPath = path.join(__dirname, '../1Storage');
			if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

			//Директория файла
			const filePath = path.join(folderPath, 'Names.json');


			var json = {};

			//Проверка наличия файла
			if (fs.existsSync(filePath)) {
				//Содержимое файла
				var data = fs.readFileSync(filePath, 'utf-8');

				//Проверка, чтобы убрать краш отсутствием в data начальных скобок '{}'
				if (!data.startsWith('{')) data = '{}';

				//Преобразование строки в объект
				json = JSON.parse(data);
			};

			//Создания колектора для кнопки
			message.createMessageComponentCollector({filter: i => i.customId === 'addmember'})
			.on('collect', async i => {

				const id = i.member.id;
				

				//Проверка во избежание повторной регистрации пользователя.
				//Можно отключить, будут изменяться его старые данные
				/*if(json.hasOwnProperty(id)) return i.reply({
					content: 'Регистрироваться на ивент можно только один раз',
					ephemeral: true
				});*/
				
				if (registered > 31) return i.reply({
					content: 'Достигнут максимально количество игроков - 31',
					ephemeral: true
				})

				await i.showModal(modal);

				//Коллектор для модала и время ограничения
				i.awaitModalSubmit({filter: i => i.customId === 'registration' && i.member.id === id,time: 120_000})
				.then(async i => {
					const socialClub = i.fields.getTextInputValue('socialClub');

					if (!json[id]?.registered) registered++;

					//Объект с введенными данными
					json[id] = {
						'name': i.member.displayName,
						'social': socialClub,
						'registered': true
					};


					//Прибавляем кол-во зарегистрированных
					
					
					console.log(
						`---\nЗарегистрировалось ${registered} пользователь/ей\n${i.member.displayName}\n`
						+`https://discord.com/channels/${interaction.guildId}/`
						+`${interaction.channelId}/${message.id}`
					);

					//Обновление модала, чтобы он пропал
					await i.deferUpdate();
                    
					//Запись в файл форматированного текста. 2 - пробел
					fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
				})
				.catch(err => console.log(`---\n${err.message}\nMemberId: ${id}`));
			});
		} catch (error) {
			console.log(error);
			//await interaction.followUp({content: error.message, ephemeral: true});
		}
	}
}