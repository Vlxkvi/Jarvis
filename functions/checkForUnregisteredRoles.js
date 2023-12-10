const { EmbedBuilder } = require("discord.js");
const fs = require('fs').promises; 

async function checkForUnregisteredRoles(client, logID) {
    try {
        const usingTime = Math.floor(Date.now() / 1000);
        const roles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const logChannel = await client.channels.fetch('1128424838692880464');
        let output = ''

        let RolesList = [];
        try {
          // Reading roleslist.json
          const data = await fs.readFile('1Storage/roleslist.json', 'utf8');
          RolesList = JSON.parse(data);
        } catch (err) {
          // Catching error
          console.error('Error reading roleslist.json:', err);
        } 

        for (let roleId of roles) {
            let role = await guild.roles.fetch(roleId);
            let usersWithRole = role.members;
            usersWithRole.forEach(user => {
                const keyToCheck = `${user.id}-${roleId}`;

                const indexToFind = RolesList.findIndex(entry => Object.keys(entry)[0] === keyToCheck);   
                if (indexToFind == -1) {
                    // Add to Json  
                    RolesList.push({
                        [keyToCheck]: usingTime,
                    });
                    output += `\n${user}-${role}`
                } 
            });
        }

        // Writing the updated rolesList back to the file
        await fs.writeFile('1Storage/roleslist.json', JSON.stringify(RolesList, null, 2));
        
        if(output != '') {
            const Embed = new EmbedBuilder()
                .setColor(0xB1F73E)
                .setDescription(output)
                .setTimestamp()
                .setTitle('Found and added:')

            await logChannel.send({ embeds: [Embed] });
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    checkForUnregisteredRoles 
};