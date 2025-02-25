const { EmbedBuilder, Permissions, roleMention } = require("discord.js");
const fs = require('fs').promises; 
const { mainColor, midColor, successColor } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    const usingTime = Math.floor(Date.now() / 1000);
    try {
      await interaction.deferReply({});
      let color = midColor;
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

        // Checking if the role was given more than 10 minutes ago
        if (usingTime - roleTime < 600) {
          // Removing the role from the member
          member.roles.remove(roleOption.id);

          // Deleting from rolesList
          rolesList.splice(indexToDelete, 1);
          output = `Role ${roleOption} was removed from ${userOption}`;
          color = successColor
        } else {
          output = `Role ${roleOption} was given ${userOption} more than 10 minutes ago.\nAsk <@&760197563205943308> or <@&713451470648770583>`;
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
