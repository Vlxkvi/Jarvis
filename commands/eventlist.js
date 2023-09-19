const {SlashCommandBuilder,EmbedBuilder} = require("discord.js");
const fs = require('fs'); 
const path = require('path');
require("dotenv/config");

module.exports = {
	async execute(interaction) {
		try {
		
			const loadingEmbed = new EmbedBuilder()
			.setColor(0x9caef2)
			.setDescription('Assigning roles, it\'ll take few seconds')
			.setTimestamp()
			.setFooter({ text: 'Jar𝕧is' });
	
		  	await interaction.reply({ embeds: [loadingEmbed], fetchReply: true });
			
			//Директория папки и проверка её существованивания
			const folderPath = path.join(__dirname, '../1Storage');
			if (!fs.existsSync(folderPath)) return interaction.reply({
				content: 'Отсутствует директория файла',
				ephemeral: true}
			);

			//Директория файла
			const filePath = path.join(folderPath, 'Names.json');

			//Проверка наличия файла
			if (!fs.existsSync(filePath)) return interaction.reply({content: 'Файл со списком отсутствует'});

			//Содержимое файла
			const data = fs.readFileSync(filePath, 'utf-8');

			//Если файл пустой
			if (data.length < 5) return interaction.reply({
				content: 'Списки ивентов пусты',
				ephemeral: true
			});

			//Преобразование строки в объект
			const json = JSON.parse(data);


			//Преобразование объекта в строку
			function list() {
				var num = 1;
				var str = '';
				for (let key in json) {
					if (!json.hasOwnProperty(key)) break;
					const Obj = json[key];
					str += `${num++}. <@${key}> - ${Obj.social}\n\n`;
				}
				return str
			}

			const embed = new EmbedBuilder()
				.setColor(0x9caef2)
				.setTitle('Список зарегистрированных на ивент')
				.setDescription(list())
				.setFooter({
					text: `Запросил ${interaction.member.displayName}`,
					iconURL: interaction.member.displayAvatarURL()
				})
				.setTimestamp();

			await interaction.editReply({embeds: [embed], ephemeral: false})

		} catch (error) {
			console.log(error);
			await interaction.editReply(`<@163547278882111488>\n${error.message}`);
		}
	}
}
