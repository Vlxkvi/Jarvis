const { EmbedBuilder } = require("discord.js");
const fs = require('fs').promises; 
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    try{
      const loadingEmbed = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription('I\'m working on it, it may take a few seconds...')
          .setTimestamp()
          .setFooter({ text: 'Jar𝕧is' });

      await interaction.reply({ embeds: [loadingEmbed], fetchReply: true });


      let RolesList = [];
      let output = '';
      let output2 = '';
      let output3 = '';

      try {
        // Reading roleslist.json
        const data = await fs.readFile('roleslist.json', 'utf8');
        RolesList = JSON.parse(data);
      } catch (err) {
        // Catching error
        console.error('Error reading roleslist.json:', err);
      }  
        
      if(Object.keys(RolesList).length === 0) {output = `No roles are given at this time`}
      else{

        RolesList.forEach((entry) => {
          const key = Object.keys(entry)[0]; // Отримуємо ключ з запису JSON
          const { role, user1, user2, user3, user4, user5 } = entry[key];
              
          const formattedTime = `<t:${key}:f> (<t:${key}:R>)`;
              
          const roleid = interaction.guild.roles.cache.get(role)?.id || 'Unknown Role';
          const usersWithRole = [user1, user2, user3, user4, user5].filter(Boolean).map((userId) => `<@${userId}>`).join(', ');
              
          if(output.length < 1800){
            output += `${formattedTime}\n<@&${roleid}> - ${usersWithRole}\n\n`
            return
          }
          if(output2.length < 1800){
            output2 += `${formattedTime}\n<@&${roleid}> - ${usersWithRole}\n\n`
            return
          }
          if(output3.length < 1800){
            output3 += `${formattedTime}\n<@&${roleid}> - ${usersWithRole}\n\n`
            return
          }
        });
      }
      let temprolesEmbed = new EmbedBuilder()
        .setTitle('Current roles:')
        .setColor(0x9caef2)
        .setDescription(output)
        
      interaction.editReply({ embeds: [temprolesEmbed] }); 

      if (output2) {
        let temprolesEmbed2 = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription(output2)
        interaction.editReply({ embeds: [temprolesEmbed, temprolesEmbed2] });
      } 

      if (output3) {
        let temprolesEmbed3 = new EmbedBuilder()
          .setColor(0x9caef2)
          .setDescription(output3)
        interaction.editReply({ embeds: [temprolesEmbed, temprolesEmbed2, temprolesEmbed3] });
      } 
    }
    catch(error){console.error(error)}
  },
};
