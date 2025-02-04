const { EmbedBuilder } = require("discord.js");
const { successColor, failColor, midColor } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try{
      const userOption = interaction.options.getUser('user');
      const user = interaction.guild.members.cache.get(userOption.id);
      let flag = true //True for giving roles, false for removing

      const eventRoles = [
        '758764390681542718',
        '888895130357071912'
      ];
      const hasAnyEventRole = eventRoles.some(roleId => user.roles.cache.has(roleId));
      
      if (hasAnyEventRole) {
        // Removing
        flag = false
        eventRoles.forEach((role, i) => { // Looping through the members of Role.
          setTimeout(() => {
            user.roles.remove(role); // Removing the role.
          }, i * 1000);
        });
        color = failColor
      } else {
        // Adding
        eventRoles.forEach((role, i) => { // Looping through the members of Role.
          setTimeout(() => {
            user.roles.add(role); // Adding the role.
          }, i * 1000);
        });
        color = successColor
      }
      const embed = new EmbedBuilder()
        .setColor(color)
        .addFields(
          { name: flag ? '**Gave**' : '**Removed**', value: `<@&758764390681542718>\n<@&888895130357071912>`, inline: true },
          { name: flag? '**to:**' : '**from:**', value: `<@${user.id}>`, inline: true }
        )
        //.setTimestamp
      await interaction.reply({ embeds: [embed] });
    }
    catch(error){
        console.error(error);
        await interaction.reply({ content: `An error occurred:\n\n${error}`, ephemeral: true });
    }
  },
};