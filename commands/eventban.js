const { EmbedBuilder, time } = require("discord.js");
const fs = require('fs');
const { successColor, failColor, midColor } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try{
        const userOption = interaction.options.getUser('user')
        const user = interaction.guild.members.cache.get(userOption.id)

        const timeOption = interaction.options.getInteger('time')

        const roleId = '798956896760496158'
        const now = Math.floor(Date.now() / 1000)
        let finaltime
        let output
        let hasInJson = false
        
        //let banRolesList = readJSON('1Storage/banroleslist.json');
        const banRolesList = [
          {"728184847692070922-798956896760496158": 1752759331}
        ];
        
        let keyToPush = `${user.id}-${roleId}`

        const hasRole = user.roles.cache.some(role => role.id === roleId);
        if(keyToPush in banRolesList){
          hasInJson = true
        }
        console.log(hasRole)
        console.log(hasInJson)
        console.log(keyToPush)  
        console.log(typeof banRolesList)
        console.log(banRolesList)
        console.log(Object.values(banRolesList))

        const embed = new EmbedBuilder()

        if (hasRole || hasInJson) {
          if(hasRole && hasInJson){
            output = `**<@${user.id}> already has <@&798956896760496158> role**`;
          }
          else if(hasInJson){
            output = `**<@${user.id}> is in \`banroleslist.json\` file but doesn't seem to have <@&798956896760496158> role.**`;
          }
          color = failColor.toString(16)

          embed.setDescription(output)
        } else {
          //user.roles.add(roleId); // Adding
          
          embed.addFields(
            { name: 'Gave', value: `<@&798956896760496158>`, inline: true },
            { name: 'to:', value: `<@${user.id}>`, inline: true }
          )
          color = successColor.toString(16)
        
          // if endtime was set
          if( timeOption !== undefined && timeOption === 1 ){
            finaltime = now + 60*60*24*30*12
            banRolesList.push({ [keyToPush]: finaltime, })
            writeJSON(banRolesList, '1Storage/banroleslist.json')

            embed.addFields(
              { name: 'Will expire on:', value: `<t:${finaltime}> (<t:${finaltime}:R>)`, inline: true },
            )
          }
        }
  
        embed.setColor(color)
        embed.setAuthor({name: `${user.displayName} (${user.name})`, iconURL: user.displayAvatarURL(),})
        await interaction.reply({ embeds: [embed] });
      }
      catch(error){
          console.error(error);
          await interaction.reply({ content: `An error occurred:\n\n${error}`, ephemeral: true });
      }
  },
};

function readJSON(filePath) {
  let RolesList = [];
  try { // Reading json
    const data = fs.readFileSync(filePath, 'utf8');
    RolesList = JSON.parse(data);
  } catch (error) { }
  return RolesList; // Return the list
}

function writeJSON(RolesList, filePath) {
  try { // Writing to json
    const jsonData = JSON.stringify(RolesList, null, 2);
    fs.writeFileSync(filePath, jsonData);
  } catch (err) { }
}