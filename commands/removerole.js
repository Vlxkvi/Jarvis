const { EmbedBuilder, Permissions, roleMention } = require("discord.js");
const fs = require('fs').promises; 
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    const usingTime = Math.floor(Date.now() / 1000);
    try {
      await interaction.deferReply({});
        let color = 0xE8D144;
      // Getting role and users from options
      const roleOption = interaction.options.getRole('role');
      const userOption = interaction.options.getUser('user');
      
      // Creating variables of options
      const member = interaction.guild.members.cache.get(userOption.id);

      let output = '';
  
      let rolesList = [];
      try {
        // Reading roleslist.json
        const data = await fs.readFile('1Storage/roleslist.json', 'utf8');
        rolesList = JSON.parse(data);
      } catch (err) {
        // Catching error
        console.error('Error reading roleslist.json:', err);
      } 
      
      const keyToCheck = `${userOption.id}-${roleOption.id}`;

      const indexToDelete = rolesList.findIndex(entry => Object.keys(entry)[0] === keyToCheck);
      if (indexToDelete !== -1) {
        const roleTime = rolesList[indexToDelete][keyToCheck];

        console.log(usingTime - roleTime)
        // Checking if the role was given more than 10 minutes ago
        if (usingTime - roleTime < 600) {
          // Removing the role from the member
          member.roles.remove(roleOption.id);

          // Deleting from rolesList
          rolesList.splice(indexToDelete, 1);
          output = `Role ${roleOption} was removed from ${userOption}`;
          color = 0xB1F73E
        } else {
          output = `Role ${roleOption} was given more than 10 minutes ago.\nAsk <@&760197563205943308> or <@&713451470648770583>`;
        }
      } else {
        output = `${userOption} does not have ${roleOption} role`;
      }

      // Making embed reply
      const roleEmbed = new EmbedBuilder()
        .setColor(color)
        .setDescription(output);

      // Editing sent message with new embed
      interaction.editReply({ embeds: [roleEmbed] });
      
      // Writing the updated rolesList back to the file
      await fs.writeFile('1Storage/roleslist.json', JSON.stringify(rolesList, null, 2));

    } catch (error) {
      console.log(error);

      interaction.editReply(`Error! <@163547278882111488> check console.`);
    }
  },
};
