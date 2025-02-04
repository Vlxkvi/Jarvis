const { EmbedBuilder, Permissions, MessageActionRow, MessageButton } = require("discord.js");
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      const messageId = interaction.options.getString('link');
      const cachedMessage = await interaction.channel.messages.fetch(messageId);

      // Перевірка, чи є у повідомленні компоненти (кнопки)
      if (cachedMessage.components && cachedMessage.components.length > 0) {
        // Видаляємо компоненти (кнопки) з повідомлення
        await cachedMessage.edit({
          components: []
        });
      }

      // Редагуємо контент повідомлення
      await cachedMessage.edit({
        content: interaction.options.getString('newmessage')
      });

      interaction.reply({content:`Edited the message successfully.`, ephemeral:true});
    } catch (error) {
      console.error(error);
      interaction.reply(`An error occurred while editing the message.`);
    }
  },
};
