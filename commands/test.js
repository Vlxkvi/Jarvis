const { EmbedBuilder } = require("discord.js");
const { MessageAttachment } = require('discord.js');
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      const roleIds = [
        '1082959761462525982',
        '822881069531398184',
        '952191329880899624',
        '952191316186513458',
        '822881067584847902',
        '1113652769497296947',
        '981487288515182613',
        '981487309096620062',
        '1080329769440256111',
        '1080330366432313425',
        '1080331318560309338',
        '1080330863016943617',
        '1080332111367643157',
        '1080331645128814652',
        '1284612338053550185',
        '1284630340014440539',
        '1284633288211955753',
        '1284633884470018059',
        '1284634221670826027',
        '1284634482359668788',
        '1284634795359469569'
      ];

      const newRoleId = '1325572541581885551';
      const uniqueUsers = new Set();

      for (const roleId of roleIds) {
        const role = await interaction.guild.roles.fetch(roleId);
        if (role) {
          role.members.forEach(member => uniqueUsers.add(member));
        }
      }

      const userList = Array.from(uniqueUsers).map(member => `<@${member.id}>`).join('\n');

      for (const member of uniqueUsers) {
        for (const roleId of roleIds) {
          await member.roles.remove(roleId);
        }
        await member.roles.add(newRoleId);
      }

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Унікальні користувачі з вказаними ролями')
        .setDescription(userList);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while processing roles.', ephemeral: true });
    }
  },
};
