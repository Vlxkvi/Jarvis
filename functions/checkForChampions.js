const { EmbedBuilder } = require("discord.js");
const { eventRoles } = require("../oftenused.js")

async function checkForChampions(client, logID) {
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const logChannel = await client.channels.fetch(logID);

        let membersWithAllRoles = [];
        let flag = 0
        
        for (const roleId of eventRoles) {
            const role = await guild.roles.fetch(roleId);
            const membersWithThisRole = role.members.map(member => member.id);

            if (membersWithAllRoles.length === 0 &&  flag == 0) {
            // For the first role, add all members
            membersWithAllRoles = membersWithThisRole;
            } else {
            // For subsequent roles, keep only those who have the role
            membersWithAllRoles = membersWithAllRoles.filter(memberId => membersWithThisRole.includes(memberId));
            }
            
            flag++;
        }

        let outputStatus = '';
        
        // for everyone who has all 10 roles
        for (const memberID of membersWithAllRoles) {
            outputStatus += await addChampion(guild, memberID)
        }

        if (outputStatus != '') {
            const Embed = new EmbedBuilder()
                .setColor(0xdc143c)
                .setTitle('Users who got new Champion role:')
                .setDescription(outputStatus)
                .setTimestamp()

            await logChannel.send({ embeds: [Embed] });
        }
    } catch (error) {
        console.error(error);
    }
}

async function addChampion(guild, memberID){
    try{
        const champions = ['971450716222795907', '1097200228156846090', '1097200811295121418', '1097200822196109534', '1097200827485130792']
        const member = guild.members.cache.get(memberID);
        let championNumber = -1;
        let output = ``
            
        // Checking champion role
        for (let step = 0; step < 5; step++) {
            if (member.roles.cache.find(role => role.id == champions[step])) {
                championNumber = step;
                break;
            }
        }
    
        // Removing 10 event roles
        Promise.all(eventRoles.map(roleId => member.roles.remove(roleId)));
    
        // Adding champion
        member.roles.add(champions[championNumber + 1]);
    
        // Making output message
        output = [member.id, champions[championNumber + 1]]
    
        // Checking if the member had any champion role, it gets removed
        if (championNumber != -1) {
            member.roles.remove(champions[championNumber]);
            
            output.push(champions[championNumber])
        }
        return output
    }
    catch(err){
        console.log(err)
    }
}
module.exports = {
    checkForChampions, addChampion
};
