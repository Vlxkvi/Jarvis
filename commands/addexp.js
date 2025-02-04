const { EmbedBuilder, User } = require("discord.js");
const fs = require('fs/promises');  // Використовуємо fs/promises для асинхронного читання файлів
require("dotenv/config");

let editMessageId = null;

module.exports = {
  async execute(interaction, client) {
    try {
      await interaction.deferReply({ ephemeral: true });

      // Getting user and amount from options
      const userOption = interaction.options.getUser('user');
      const amount = interaction.options.get('amount').value;
      let isNewSessionOption = interaction.options.getBoolean('isnewsession')

      let output = '';

      // Reading expCounts.json
      const data = await fs.readFile('1Storage/expCounts.json', 'utf8');

      // Parse JSON data and convert it to a Map
      let expCounts = new Map(Object.entries(JSON.parse(data)));

      if(editMessageId == null){ isNewSessionOption = true }

      if(isNewSessionOption){ expCounts.clear() }

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
        .setDescription(output)
        .setImage('https://media.tenor.com/3HFKgdT-FiQAAAAi/line-rainbow.gif')

      if (isNewSessionOption) {
        const sentMessage = await interaction.channel.send({ embeds: [roleEmbed], ephemeral: false });
        editMessageId = sentMessage.id;
        await interaction.editReply({ content: `Created new list, succesfully added ${amount} XP to ${userOption}.`})
      } else {
        const editMessage = await interaction.channel.messages.fetch(editMessageId);
        await editMessage.edit({ embeds: [roleEmbed] });
        await interaction.followUp({ content: `Succesfully added ${amount} XP to ${userOption}.`, ephemeral: true});
      }

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
