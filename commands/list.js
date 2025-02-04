const { EmbedBuilder } = require("discord.js");
const { eventRoles, mainColor } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      await interaction.deferReply({});
      
      const roleData = await Promise.all(
        eventRoles.map(async (roleId) => {
          const role = await interaction.guild.roles.fetch(roleId);
          const count = role.members.size;
          return { id: role.id, name: role.name, count };
        })
      );

      roleData.sort((a, b) => a.count - b.count);

      let output = '';
      roleData.forEach(({ count, id }) => {
        output += `\` ${count.toString().padStart(2, '0')} \` <@&${id}>\n`;
      });
      
      const roleEmbed = new EmbedBuilder()
        .setTitle('Event roles list')
        .setColor(mainColor)
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
