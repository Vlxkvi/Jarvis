const { EmbedBuilder, Permissions, roleMention } = require("discord.js");
const fs = require('fs').promises; 
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    const usingTime = Math.floor(Date.now() / 1000);
    try {
      await interaction.deferReply({})

      // Getting role and users from options
      const roleOption = interaction.options.getRole('role');
      const userOption1 = interaction.options.getUser('user1');
      const userOption2 = interaction.options.getUser('user2');
      const userOption3 = interaction.options.getUser('user3');
      const userOption4 = interaction.options.getUser('user4');
      const userOption5 = interaction.options.getUser('user5');

      // Creating variables of options
      const user1 = interaction.guild.members.cache.get(userOption1.id);
      const user2 = userOption2 ? interaction.guild.members.cache.get(userOption2.id) : null;
      const user3 = userOption3 ? interaction.guild.members.cache.get(userOption3.id) : null;
      const user4 = userOption4 ? interaction.guild.members.cache.get(userOption4.id) : null;
      const user5 = userOption5 ? interaction.guild.members.cache.get(userOption5.id) : null; 
      let users = [user1, user2, user3, user4, user5]

      // Checking if users have specified role
      const eventRoles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];
      
      let addedRightRole = []
      let addedAnotherRole = []
      let usersWithAllRoles = []

      let RolesList = [];
      try {
        // Reading roleslist.json

        const data = await fs.readFile('1Storage/roleslist.json', 'utf8');
        RolesList = JSON.parse(data);
      } catch (err) {
        // Catching error
        console.error('Error reading roleslist.json:', err);
      } 

      users.forEach(user => {
        if (!user){return}
        keyToPush = `${user.id}-${roleOption.id}`

        let notFoundRolesArray = NotFoundRoles(user, eventRoles)

        // If user doesn't have specified role
        if ( notFoundRolesArray.includes(roleOption.id) ){
          // Add to Json  
          RolesList.push({
            [keyToPush]: usingTime,
          });

          // Add to array of correctly added roles
          addedRightRole.push(user.id)

          // Add role
          user.roles.add(roleOption)
        }
        else  if( notFoundRolesArray.length == 0 ){
          usersWithAllRoles.push(user.id)
        }
        else{
          for (const role in addedAnotherRole) {
            if (notFoundRolesArray[0] in addedAnotherRole[role]) {
              addedAnotherRole[role][notFoundRolesArray[0]].push(user.id);
              keyToPush = `${user.id}-${notFoundRolesArray[0]}`

              // Add to Json  
              RolesList.push({
                [keyToPush]: usingTime,
              });

              // Add role
              user.roles.add(notFoundRolesArray[0])
              return;
            }
          }
          
          addedAnotherRole.push({ [notFoundRolesArray[0]]: [user.id] })

          // Add role
          user.roles.add(notFoundRolesArray[0])

          keyToPush = `${user.id}-${notFoundRolesArray[0]}`

          // Add to Json  
          RolesList.push({
            [keyToPush]: usingTime,
          });
        }
      })

      // Function returning array of missing roles
      function NotFoundRoles(user, rolesArray){
        let Array = []
        for(let step = 0; step<rolesArray.length; step++){
          if( !user.roles.cache.find(role => role.id == rolesArray[step]) ){
            Array.push(rolesArray[step])
          } 
        }
        return Array
      }

      let output = ''

      // Users who got specified role
      if(addedRightRole.length != 0){
        output += `Role ${roleOption} added to: `
        for (let i = 0; i < addedRightRole.length; i++) {
          output += addedRightRole[i] ? `<@${addedRightRole[i]}> ` : '';
        }
      }

      // Users who got other roles
      for (let objIndex = 0; objIndex < Object.keys(addedAnotherRole).length; objIndex++) {
        const object = addedAnotherRole[objIndex];
        output += `\n Role <@&${Object.keys(object)[0]}> added to: `;

        for (let i = 0; i < 5; i++) {
          output += object[Object.keys(object)[0]][i] ? ` <@${object[Object.keys(object)[0]][i]}>` : '';
        }
      }

      // Users who have all roles
      if (usersWithAllRoles.length != 0){
        output += `Users who already have all 10 roles:`
        for ( i = 0; i < usersWithAllRoles.length; i++){
          output += ` ${usersWithAllRoles[i]}`
        }
      }
      // Rewriting roleslist.json
      try {
        const jsonData = JSON.stringify(RolesList, null, 2);
        await fs.writeFile('1Storage/roleslist.json', jsonData);
      } catch (err) {
        // If there was an error writing data to json file
        console.error('Error writing to roleslist.json:', err);
      }
      
      // Making embed reply
      let roleEmbed = new EmbedBuilder()
      .setColor(0x45f03e)
      .setDescription(output);

      // Editing sent message with new embed
      interaction.editReply({ embeds: [roleEmbed] });
      
    } catch (error) {
      console.log(error)

      interaction.editReply(`Error! <@163547278882111488> check console.`);
    }
  },
};
