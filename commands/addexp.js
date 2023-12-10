const { EmbedBuilder } = require("discord.js");
const fs = require('fs/promises');  // Використовуємо fs/promises для асинхронного читання файлів
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    try {
      await interaction.deferReply({});

      // Getting user and amount from options
      const userOption = interaction.options.getUser('user');
      const amount = interaction.options.get('amount').value;

      let output = '';

      // Reading expCounts.json
      const data = await fs.readFile('1Storage/expCounts.json', 'utf8');

      // Parse JSON data and convert it to a Map
      let expCounts = new Map(Object.entries(JSON.parse(data)));

      if (expCounts.has(userOption.id)) {
        // Update user's experience
        let newAmount = expCounts.get(userOption.id) + amount;
        expCounts.set(userOption.id, newAmount);
      } else {
        // Add user to expCounts
        expCounts.set(userOption.id, amount);
      }

      // Creating a string for output
      expCounts.forEach((value, key) => {
        output += `\n<@${key}>\`\`\`*exp ${key} +${value}\`\`\``;
      });

      // Making embed reply
      const roleEmbed = new EmbedBuilder()
        .setColor(0xE8D144)
        .setDescription(output);

      // Editing sent message with new embed
      interaction.editReply({ embeds: [roleEmbed] });

      // Writing the updated expCounts back to the file
      try {
        await fs.writeFile('1Storage/expCounts.json', JSON.stringify(Object.fromEntries(expCounts), null, 2));
      } catch (writeError) {
        console.error('Error writing expCounts.json:', writeError);
      }

    } catch (error) {
      console.log(error);
      interaction.editReply(`Error! <@163547278882111488> check console.`);
    }
  },
};
