const { EmbedBuilder } = require("discord.js")
const fs = require('fs');
require("dotenv/config")

module.exports = {
  async execute(interaction, client, guild) {

    const usingTime = Math.floor(Date.now() / 1000)

    // Припустимо, у вас є словник (об'єкт)
    const RolesList = {
      apple: 'яблуко23',
      orange: 'апельсин23',
      banana: 'банан23',
      cherry: 'вишня23',
    };

    RolesList.push({
      key: usingTime
      
    })

    // Конвертуємо словник в рядок JSON
    const jsonData = JSON.stringify(RolesList, null, 2);

    // Записуємо рядок JSON у файл з назвою "dictionary.json"
    fs.writeFileSync('roleslist.json', jsonData);
    output = 'Словник був занесений в roleslist.json'

    console.log(output);



    fs.readFile('roleslist.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Помилка при читанні файлу:', err);
        return;
      }
    
      try {
        // Парсимо (розпізнаємо) JSON рядок у JavaScript об'єкт
        const RolesList2 = JSON.parse(data);
    
        // Ви можете використовувати `RolesList` так, як ви бажаєте
        console.log('Зміст JSON файлу:');
        console.log(RolesList2);
      } catch (error) {
        console.error('Помилка при парсінгу JSON:', error);
      }
    });

    output = output + `<t:${usingTime}:f>`

    const roleEmbed = new EmbedBuilder()
      .setColor(0x9caef2)
      .setDescription(output)
      .setTimestamp()
      .setFooter({ text: 'Jar𝕧is' });

    interaction.reply({ embeds: [roleEmbed] });
    },
  };