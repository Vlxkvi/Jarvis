const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const { addChampion } = require("../functions/checkForChampions.js");
const { eventRoles } = require("../oftenused.js");
require("dotenv/config");

// Function returning array of missing roles
function NotFoundRoles(user, rolesArray) {
  let Array = [];
  for (let step = 0; step < rolesArray.length; step++) {
    if (!user.roles.cache.find(role => role.id == rolesArray[step])) {
      Array.push(rolesArray[step]);
    }
  }
  return Array;
}

module.exports = {
  async execute(interaction, client) {
    const usingTime = Math.floor(Date.now() / 1000);
    await interaction.deferReply({})
    try {
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

      let addedRightRole = []
      let addedAnotherRole = []
      let outputUsersToCopy = ''
      let outputRolesToCopy = ''
      let outputGotChampion = ``

      let RolesList = [];
      try {
        // Reading roleslist.json
        const data = fs.readFileSync('1Storage/roleslist.json', 'utf8');
        RolesList = JSON.parse(data);
      } catch (err) {
        // Catching error
        console.log('Error reading roleslist.json:', err);
      }
      console.log(typeof(RolesList))

      for (const user of users) {
        if (!user) { continue; }
        let keyToPush = `${user.id}-${roleOption.id}`
        if(keyToPush in RolesList){
          console.log(`User already has this role`)
        }

        let notFoundRolesArray = NotFoundRoles(user, eventRoles)

        // if roleOption is not an event role
        if( !eventRoles.includes(roleOption.id) ){
          // if user has all 10 event roles
         if(notFoundRolesArray.length == 0){
            // give champion
          }
          user.roles.add(roleOption) // add role
          addedAnotherRole.push([user.id, roleOption.id]) // add info about given role to set it in output later

          RolesList.push({ [keyToPush]: usingTime, }); // add to roleslist.json
        }
        // if roleOption is an event role
        else{
          // if user has 9 roles, and roleOption is meant to be 10th, give champion right away and remove 9 roles
          if(notFoundRolesArray.length == 1){
            outputGotChampion = await addChampion(interaction.guild, user.id)

            for (const role of eventRoles) {
              user.roles.remove(role);
            }
          }
        }

        // if user has 10 or 9 roles
        if ( notFoundRolesArray.length <= 1 ) {
          

          for (const role of eventRoles) {
            if(notFoundRolesArray.length == 0 && role == roleOption.id){
              console.log(`found role that i should not delete: ${role}. roleoption - ${roleOption.id}`)
              addedAnotherRole.push([user.id, roleOption.id])
              continue
            }
            console.log(`found role that i should delete`)
            user.roles.remove(role);
          }
          
          // if roleOption is not an event role
          if(!eventRoles.includes(roleOption.id)){
            await user.roles.add(roleOption) 
            addedAnotherRole.push([user.id, roleOption.id])
          }
        }
        else{

        }

        // If user doesn't have specified role
        if (notFoundRolesArray.includes(roleOption.id) || !eventRoles.includes(roleOption.id)) {
          // Add to Json  
          RolesList.push({ [keyToPush]: usingTime });

          // Add to array of correctly added roles
          addedRightRole.push(user.id)

          // Add role
          await user.roles.add(roleOption) // Await to ensure role is added
        }
        else {
          let found = false;
          for (const role of addedAnotherRole) {
            if (notFoundRolesArray[0] in role) {
              role[notFoundRolesArray[0]].push(user.id);
              keyToPush = `${user.id}-${notFoundRolesArray[0]}`

              // Add to Json  
              RolesList.push({ [keyToPush]: usingTime });

              // Add role
              await user.roles.add(notFoundRolesArray[0]) // Await to ensure role is added
              found = true;
              break;
            }
          }
          if (!found) {
            let newRoleObj = { [notFoundRolesArray[0]]: [user.id] };
            addedAnotherRole.push(newRoleObj)

            // Add role
            await user.roles.add(notFoundRolesArray[0]) // Await to ensure role is added

            keyToPush = `${user.id}-${notFoundRolesArray[0]}`

            // Add to Json  
            RolesList.push({ [keyToPush]: usingTime });
          }
        }
      }

      let output = ''

      // Users who got specified role
      if (addedRightRole.length != 0) {
        outputUsersToCopy += `1. `
        outputRolesToCopy += `2. `
        output += `Role ${roleOption} added to: `
        for (let i = 0; i < addedRightRole.length; i++) {
          output += addedRightRole[i] ? `<@${addedRightRole[i]}> ` : '';

          outputRolesToCopy += `${roleOption} `
          outputUsersToCopy += `<@${addedRightRole[i]}> `
        }
      }

      // Users who got other roles
      for (let objIndex = 0; objIndex < Object.keys(addedAnotherRole).length; objIndex++) {
        const object = addedAnotherRole[objIndex];
        output += `\n Role <@&${Object.keys(object)[0]}> added to: `;

        for (let i = 0; i < 5; i++) {
          output += object[Object.keys(object)[0]][i] ? ` <@${object[Object.keys(object)[0]][i]}>` : '';
          if (object[Object.keys(object)[0]][i]) {
            outputRolesToCopy += `<@&${Object.keys(object)[0]}> `
            outputUsersToCopy += `<@${object[Object.keys(object)[0]][i]}> `
          }

        }
      }

      // Rewriting roleslist.json
      try {
        const jsonData = JSON.stringify(RolesList, null, 2);
        fs.writeFileSync('1Storage/roleslist.json', jsonData);
      } catch (err) {
        // If there was an error writing data to json file
        console.error('Error writing to roleslist.json:', err);
      }

      if(addedRightRole.length != 0 || addedAnotherRole.length != 0){
        output += `\n\`\`\`${outputUsersToCopy}\n${outputRolesToCopy}\`\`\``
        output += outputGotChampion
      }

      // Making embed reply
      let roleEmbed = new EmbedBuilder()
        .setColor(0x45f03e)
        .setDescription(output);

      // Editing sent message with new embed
      await interaction.editReply({ embeds: [roleEmbed] });

    } catch (error) {
      console.log(error)

      interaction.editReply(`Error! <@163547278882111488> check console.`);
    }
  },
};