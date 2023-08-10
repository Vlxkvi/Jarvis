const { EmbedBuilder } = require("discord.js");
const fs = require('fs').promises; 
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    let RolesList = [];
    let output = '';

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
            
        output += `${formattedTime}\n<@&${roleid}> - ${usersWithRole}\n\n`;
      });
    }

    let temprolesEmbed = new EmbedBuilder()
      .setTitle('Current roles:')
      .setColor(0x9caef2)
      .setDescription(output)
      .setTimestamp()
      .setFooter({ text: 'Jar𝕧is' });

    interaction.reply({ embeds: [temprolesEmbed] });
  },
};
