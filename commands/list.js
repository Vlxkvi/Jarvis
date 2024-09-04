const { EmbedBuilder } = require("discord.js");
const { eventRoles } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      await interaction.deferReply({});
      
      let output = '';

      for (let roleId of eventRoles) {
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
