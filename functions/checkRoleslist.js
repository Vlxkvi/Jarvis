const fs = require('fs').promises;
const { EmbedBuilder } = require("discord.js");
require("dotenv/config")

async function checkRoleslist(path, client) {
    try {
        console.log('started')
        const currentTime = Math.floor(Date.now() / 1000);

        // Read roleslist.json
        const data = await fs.readFile(path, 'utf8');
        const rolesList = JSON.parse(data);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID);

        let newRolesList = [];
        let expiredRoles = {};
        let userId
        let roleId
        let keepingTime

        switch (path) {
            case '1Storage/roleslist.json':
                keepingTime = 30 * 24 * 60 * 60;
                console.log(`roleslist`)       
                break;    
            case '1Storage/banroleslist.json':
                keepingTime = 12 * 30 * 24 * 60 * 60;  
                console.log(`banroleslist`)       
                break;      
        }
        console.log(keepingTime)
        if(path == '1Storage/roleslist.json'){

        }
        
        for (let entry of rolesList) {
            let key = Object.keys(entry)[0];
            let entryTime = parseInt(entry[key]);
            let timeDifference = currentTime - entryTime;

            if (timeDifference > keepingTime) {
                console.log(`need to remove role`)
                let parts = key.split("-");
                userId = parts[0];
                roleId = parts[1];
                
                if (!expiredRoles[roleId]) {
                    expiredRoles[roleId] = [];
                }
                expiredRoles[roleId].push(userId);
            }
            else{
                console.log(`no need`)
                let parts = key.split("-");
                userId = parts[0];
                roleId = parts[1];
                
                newRolesList.push(entry);
            }
        }

        // Update roleslist.json
        try{
            const jsonData = JSON.stringify(newRolesList, null, 2);
            await fs.writeFile('1Storage/roleslist.json', jsonData);
        }catch (err) {console.error('Error writing to roleslist.json:', err)}
        
        const logChannel = await client.channels.fetch('1128424838692880464');
        let output = '';

        for (const roleId in expiredRoles) {
          const users = expiredRoles[roleId].map(userId => `<@${userId}>`).join(' ');
      
          if (output.length < 1800) {
              output += `Role <@&${roleId}> was removed from: ${users}\n`;
          }
      
          for (const userId of expiredRoles[roleId]) {
              const member = guild.members.cache.get(userId);
              if (member) {
                  const role = guild.roles.cache.get(roleId);
                  if (role) {
                      try {
                          await member.roles.remove(role);
                      } catch (error) {
                          console.error(`Failed to remove role from user: ${error}`);
                          await logChannel.send(`Failed to remove role from user./n ${error}`);
                      }
                  }
              }
          }
      }
      

        if (output) {
            const RemovingEmbed = new EmbedBuilder()
                .setColor(0xdc143c)
                .setDescription(output)
                .setTimestamp();

            await logChannel.send({ embeds: [RemovingEmbed] });
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    checkRoleslist
};
