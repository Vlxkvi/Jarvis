const { EmbedBuilder, Permissions } = require("discord.js");
const fs = require('fs').promises; 
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    const usingTime = Math.floor(Date.now() / 1000);
    try {
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

      let RolesList = [];

      try {
        // Reading roleslist.json
        const data = await fs.readFile('roleslist.json', 'utf8');
        RolesList = JSON.parse(data);
      } catch (err) {
        // Catching error
        console.error('Error reading roleslist.json:', err);
      }

      // Adding new record to RolesList
      RolesList.push({
        [usingTime]: {
          user1: user1 ? user1.id : null,
          user2: user2 ? user2.id : null,
          user3: user3 ? user3.id : null,
          user4: user4 ? user4.id : null,
          user5: user5 ? user5.id : null,
          role: roleOption.id,
        },
      });

      // Adding roles
      user1.roles.add(roleOption);
      if (user2) {await user2.roles.add(roleOption);}
      if (user3) {await user3.roles.add(roleOption);}
      if (user4) {await user4.roles.add(roleOption);}
      if (user5) {await user5.roles.add(roleOption);}

      // making output message
      output = `Role ${roleOption} added to: `

      const usersWithRole = [];
      if (user1) usersWithRole.push( `<@${user1.id}>` );
      if (user2) usersWithRole.push( `<@${user2.id}>` );
      if (user3) usersWithRole.push( `<@${user3.id}>` );
      if (user4) usersWithRole.push( `<@${user4.id}>` );
      if (user5) usersWithRole.push( `<@${user5.id}>` );
      
      output += usersWithRole.join(', ');

      // Rewriting roleslist.json
      try {
        const jsonData = JSON.stringify(RolesList, null, 2);
        await fs.writeFile('roleslist.json', jsonData);
      } catch (err) {
        // Обробка помилки, якщо не вдалося записати у файл
        console.error('Error writing to roleslist.json:', err);
      }
    
      // Making embed reply
      let roleEmbed = new EmbedBuilder()
      .setColor(0x45f03e)
      .setDescription(output);

      interaction.reply({ embeds: [roleEmbed] });
      
    } catch (error) {
      console.log(error.message);
    }
  },
};
