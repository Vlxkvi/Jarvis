const { EmbedBuilder } = require("discord.js");
const fs = require('fs').promises; 
const { mainColor } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
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

          if (!roles[usingTime][role].includes(user)) {
            roles[usingTime][role].push(user);
          }
        });

        let previousTimeStamp = 0
        for (const timestamp in roles) {
          let usersWithRole = '';
          for (const role in roles[timestamp]) {
            const formattedRole = `<@&${role}>`;

            const formattedUsers = roles[timestamp][role].map(user => `<@${user}>`).join(' ');
            
            usersWithRole += `${formattedRole}: ${formattedUsers}\n`;
          }

          const formattedTime = `<t:${timestamp}:f> (<t:${timestamp}:R>)`;
          let formattedPart = ``
          if(Math.abs(previousTimeStamp-timestamp) > 3600){
            formattedPart += `\n${formattedTime}\n` 
          }
          formattedPart += `${usersWithRole}`

          if (output.length < 1900) {
            output += formattedPart;
          } else if (output2.length < 1900) {
            output2 += formattedPart;
          } else if (output3.length < 1900) {
            output3 += formattedPart;
          }
          previousTimeStamp = timestamp
        }
      }

      let embedsToSend = []

      let temprolesEmbed1 = new EmbedBuilder()
        .setTitle('Current roles:')
        .setColor(mainColor)
        .setDescription(output);
      embedsToSend.push(temprolesEmbed1)

      if (output2) {
        let temprolesEmbed2 = new EmbedBuilder()
          .setColor(mainColor)
          .setDescription(output2);
        embedsToSend.push(temprolesEmbed2)
      }

      if (output3) {
        let temprolesEmbed3 = new EmbedBuilder()
          .setColor(mainColor)
          .setDescription(output3);
        embedsToSend.push(temprolesEmbed3)
      }

      interaction.editReply({ embeds: embedsToSend });
    } catch (error) {
      console.error(error);
    }
  },
};
