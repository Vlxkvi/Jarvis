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

      let temprolesEmbed = new EmbedBuilder()
        .setTitle('Current roles:')
        .setColor(0x9caef2)
        .setDescription(output);

      interaction.editReply({ embeds: [temprolesEmbed] });

      if (output2 && !output3) {
        let temprolesEmbed2 = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription(output2);
        interaction.editReply({ embeds: [temprolesEmbed, temprolesEmbed2] });
      }

      if (output3) {
        let temprolesEmbed2 = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription(output2);

        let temprolesEmbed3 = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription(output3);

        interaction.editReply({ embeds: [temprolesEmbed, temprolesEmbed2, temprolesEmbed3] });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
