const { EmbedBuilder } = require("discord.js");
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    const loadingEmbed = new EmbedBuilder()
      .setColor(0x9caef2)
      .setDescription('I\'m working on it, it may take a few seconds...')
      .setTimestamp()
      .setFooter({ text: 'Jar𝕧is' });
    const loadingMessage = await interaction.reply({ embeds: [loadingEmbed], fetchReply: true });

    const userOption = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(userOption.id);
    const roles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];

    try {
      // Removing roles from the member
      await Promise.all(roles.map(roleId => member.roles.add(roleId)));

      // Creating the output message
      const outputStatus = `<@${member.id}> roles have been added successfully.`;

      const EventEmbed = new EmbedBuilder()
        .setColor(0x9caef2)
        .setDescription(outputStatus)
        .setTimestamp()
        .setFooter({ text: member.id });

      await interaction.editReply({ embeds: [EventEmbed] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'An error occurred while removing roles.', ephemeral: true });
    }
  },
};
