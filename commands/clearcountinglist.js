const { EmbedBuilder } = require("discord.js");
const fs = require('fs').promises;
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      await interaction.deferReply({});

      // Reading expCounts.json
      const data = await fs.readFile('1Storage/expCounts.json', 'utf8');

      // Parse JSON data and convert it to a Map
      let expCounts = new Map(Object.entries(JSON.parse(data)));

      // Making embed reply
      const roleEmbed = new EmbedBuilder()
        .setColor(0xE8D144)
        .setDescription('Cleared!');

      // Editing sent message with new embed and attached file
      interaction.editReply({ embeds: [roleEmbed] });

      // Clearing the expCounts array
      await expCounts.clear()

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
