const fs = require('fs').promises;
const { EmbedBuilder } = require("discord.js");

async function checkRoleslist(client) {
    try {
      const currentTime = Math.floor(Date.now() / 1000)
  
      // Read roleslist.json
      const data = await fs.readFile('roleslist.json', 'utf8');
      const rolesList = JSON.parse(data);
  
      rolesList.forEach(async (entry) => {
        const key = Object.keys(entry)[0]; 
        const entryTime = parseInt(key); 
        const timeDifference = currentTime - entryTime;
  
        // Time to keep role - 3 days
        const keepingTime = 720*60*60; 
  
        if (timeDifference > keepingTime) {
          // Removing roles 
          const { user1, user2, user3, user4, user5, role } = entry[key];
          const guild = client.guilds.cache.get(process.env.GUILD_ID);
          let userRemovedRoles = [];
  
          if (user1) {
            const member = guild.members.cache.get(user1);
            if (member) await member.roles.remove(role);
            userRemovedRoles.push( `<@${member.id}>` )
          }
          if (user2) {
            const member = guild.members.cache.get(user2);
            if (member) await member.roles.remove(role);
            userRemovedRoles.push( `<@${member.id}>` )
          }
          if (user3) {
            const member = guild.members.cache.get(user3);
            if (member) await member.roles.remove(role);
            userRemovedRoles.push( `<@${member.id}>` );
          }
          if (user4) {
            const member = guild.members.cache.get(user4);
            if (member) await member.roles.remove(role);
            userRemovedRoles.push( `<@${member.id}>` );
          }
          if (user5) {
            const member = guild.members.cache.get(user5);
            if (member) await member.roles.remove(role);
            userRemovedRoles.push( `<@${member.id}>` );
          }
          output = `Role <@&${role}> was removed from: `
          output += userRemovedRoles.join(', ');
  
          const logChannel = await client.channels.fetch('1128424838692880464');
  
           const RemovingEmbed = new EmbedBuilder()
            .setColor(0xdc143c)
            .setDescription(output)
            .setTimestamp()
  
          await logChannel.send({ embeds: [RemovingEmbed] });
  
          // Deleting record from roleslist.json
          rolesList.splice(rolesList.indexOf(entry), 1);
  
          // Rewriting roleslist.json
          try {
            const jsonData = JSON.stringify(rolesList, null, 2);
            await fs.writeFile('roleslist.json', jsonData);
          } catch (err) {
            console.error('Error writing to roleslist.json:', err);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
}

module.exports = {
    checkRoleslist
};