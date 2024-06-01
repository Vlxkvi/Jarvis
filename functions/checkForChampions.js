const { EmbedBuilder } = require("discord.js");

async function checkForChampions(client, logID) {
    try {
        const champions = ['971450716222795907', '1097200228156846090', '1097200811295121418', '1097200822196109534', '1097200827485130792']
        const roles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const logChannel = await client.channels.fetch(logID);

        let membersWithAllRoles = [];
        let flag = 0
        
        for (const roleId of roles) {
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
        let championNumber = -1;
        
        // for everyone who has all 10 roles
        for (const memberID of membersWithAllRoles) {
            addChampion(memberID, championNumber, outputStatus)
        }

        if (outputStatus != '') {
            const Embed = new EmbedBuilder()
                .setColor(0xdc143c)
                .setDescription(outputStatus)
                .setTimestamp()
                .setTitle('Users who got new Champion role:')

            await logChannel.send({ embeds: [Embed] });
        }
    } catch (error) {
        console.error(error);
    }
}

async function addChampion(memberID, championNumber, output){
    const member = guild.members.cache.get(memberID);
        
    // Checking champion role
    for (let step = 0; step < 5; step++) {
        if (member.roles.cache.find(role => role.id == champions[step])) {
            championNumber = step;
            break;
        }
    }

    // Removing 10 event roles
    await Promise.all(roles.map(roleId => member.roles.remove(roleId)));

    // Adding champion
    await member.roles.add(champions[championNumber + 1]);

    // Making output message
    output += `\n\n<@${member.id}>\n**Added** <@&${champions[championNumber + 1]}>`;

    // Checking if the member had any champion role, it gets removed
    if (championNumber != -1) {
        await member.roles.remove(champions[championNumber]);
        output += ` \n**Removed** <@&${champions[championNumber]}>`;
    }
    return output
}
module.exports = {
    checkForChampions, addChampion
};
