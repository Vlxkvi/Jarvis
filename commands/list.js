const { EmbedBuilder } = require("discord.js");
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      await interaction.deferReply({});
      
      const roles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];

      let output = '';

      for (let roleId of roles) {
        let role = await interaction.guild.roles.fetch(roleId);
        let count = role.members.size;

        if (count.toString().length < 2) {
          output += '`0' + count + '`';
        } else {
          output += '`' + count + '`';
        }
        output += ` <@&${role.id}>\n`;
      }

      const roleEmbed = new EmbedBuilder()
        .setTitle('Event roles list')
        .setColor(0x9caef2)
        .setDescription(output)
        .setTimestamp()
        .setFooter({ text: 'Jar𝕧is' });

      await interaction.editReply({ embeds: [roleEmbed] });
    } catch (error) {
      console.error('Error executing list command:', error);
      await interaction.editReply(`<@163547278882111488>\n${error.message}`);
    }
  },
};
