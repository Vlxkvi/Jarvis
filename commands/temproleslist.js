const { EmbedBuilder } = require("discord.js");
const fs = require('fs').promises; 
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    try {
      await interaction.deferReply({});

      let RolesList = [];
      let output = '';
      let output2 = '';
      let output3 = '';

      try {
        // Reading roleslist.json
        const data = await fs.readFile('1Storage/roleslist.json', 'utf8');
        RolesList = JSON.parse(data);
      } catch (err) {
        console.error('Error reading roleslist.json:', err);
      }

      let roles = {};

      if (Object.keys(RolesList).length === 0) {
        output = 'No roles are given at this time';
      } else {
        RolesList.forEach((entry) => {
          const key = Object.keys(entry)[0];
          const usingTime = entry[key];

          const parts = key.split("-");
          const user = parts[0];
          const role = parts[1];

          if (!roles[usingTime]) {
            roles[usingTime] = {};
          }

          if (!roles[usingTime][role]) {
            roles[usingTime][role] = [];
          }

          roles[usingTime][role].push(user);
        });

        for (const timestamp in roles) {
          let usersWithRole = '';
          for (const role in roles[timestamp]) {
            const formattedRole = `<@&${role}>`;
            const formattedUsers = roles[timestamp][role].map(user => `<@${user}>`).join(' ');
            usersWithRole += `${formattedRole}: ${formattedUsers}\n`;
          }

          const formattedTime = `<t:${timestamp}:f> (<t:${timestamp}:R>)`;
          if (output.length < 1900) {
            output += `${formattedTime}\n${usersWithRole}\n`;
          } else if (output2.length < 1900) {
            output2 += `${formattedTime}\n${usersWithRole}\n`;
          } else if (output3.length < 1900) {
            output3 += `${formattedTime}\n${usersWithRole}\n`;
          }
        }
      }

      let embedsToSend = []

      let temprolesEmbed1 = new EmbedBuilder()
        .setTitle('Current roles:')
        .setColor(0x9caef2)
        .setDescription(output);
      embedsToSend.push(temprolesEmbed1)

      if (output2) {
        let temprolesEmbed2 = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription(output2);
        embedsToSend.push(temprolesEmbed2)
      }

      if (output3) {
        let temprolesEmbed3 = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription(output3);
        embedsToSend.push(temprolesEmbed3)
      }

      interaction.editReply({ embeds: embedsToSend });
    } catch (error) {
      console.error(error);
    }
  },
};
