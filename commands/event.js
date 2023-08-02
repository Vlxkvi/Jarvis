const {SlashCommandBuilder,PermissionFlagsBits,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ModalBuilder,TextInputBuilder} = require('discord.js');

const fs = require('fs');
const path = require('path');
const {color} = require('../../config.json');

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
						.setCustomId('discordName')
						.setLabel('Введи свой ник Discord')
						.setStyle(1)
						.setMaxLength(32)//Максимальная длина ника дискорд
						.setRequired(true)
				),
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
					.setEmoji('1017760510604746782')
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
				.setColor(color)
				.setTitle('Очередной топовый ивент')
				.setDescription(content)
				.setFooter({text: `by .hanter.`});


			//Скип сообщенька, чтобы убрать ответ на interaction
			await interaction.reply({content: 'Отправляю...', ephemeral: true}).then(() => interaction.deleteReply());

			const message = await interaction.channel.send({
				content: needembed ? '' : content,
				embeds: needembed ? [embed] : [],
				components: [row]
			})

			//Счётчик зарегистрированных
			var registered = 0;

			//Директория папки и проверка её существованивания. Создаётся в папке с исполняемым файлом
			const folderPath = path.join(__dirname, 'Event-Names');
			if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

			//Директория файла
			const filePath = path.join(folderPath, 'Names.json');

			//Создания колектора для кнопки
			message.createMessageComponentCollector({filter: i => i.customId === 'addmember'})
			.on('collect', async i => {

				const id = i.member.id;
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

				//Проверка во избежание повторной регистрации пользователя.
				//Можно отключить, будут изменяться его старые данные
				if(json.hasOwnProperty(id)) return i.reply({
					content: 'Регистрироваться на ивент можно только один раз',
					ephemeral: true
				});
				
				if (registered > 32) return i.reply({
					content: 'Достигнут максимально количество игроков - 32 человека',
					ephemeral: true
				})

				i.showModal(modal);

				//Коллектор для модала и время ограничения
				i.awaitModalSubmit({filter: i => i.customId === 'registration',time: 120_000})
				.then(i => {
					const discordName = i.fields.getTextInputValue('discordName');
					const socialClub = i.fields.getTextInputValue('socialClub');
					/*
					Для отладки. Нужно отключить 'i.deferUpdate();' так, как 'i.reply' тоже завершает модал
					console.log(`${i.member.displayName} discordName: ${discordName} socialClub: ${socialClub}`)
					i.reply(`${i.member.displayName}\ndiscordName: ${discordName}\nsocialClub: ${socialClub}`);
					*/

					//Объект с введенными данными
					json[id] = {
						'name': i.member.displayName,
						'discord': discordName,
						'social': socialClub
					};

					//Запись в файл форматированного текста. 2 - пробел
					fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

					//Прибавляем кол-во зарегистрированных
					registered++;
					console.log(
						`---\nЗарегистрировалось ${registered} пользователь/ей\n${i.member.displayName}\n`
						+`https://discord.com/channels/${interaction.guildId}/`
						+`${interaction.channelId}/${message.id}`
					);

					//Обновление модала, чтобы он пропал
					i.deferUpdate();
				})
				.catch(err => console.log(`---\n${err.message}\nMemberId: ${id}`));
			});
		} catch (error) {
			console.log(error);
			//await interaction.followUp({content: error.message, ephemeral: true});
		}
	}
}