const { EmbedBuilder } = require("discord.js");
const { successColor, failColor, midColor } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction) {
    try{
      const userOption = interaction.options.getUser('user');
      const user = interaction.guild.members.cache.get(userOption.id);

      const roleId = '1095767610622214225' 
      const hasRole = user.roles.cache.some(role => role.id === roleId);
      let output;
      let flag = false //false if not given, true if given

      const embed = new EmbedBuilder()

      if (hasRole) {
        // Notifying that user already has this role
        output = `**<@${user.id}> already has <@&1095767610622214225> role**`;
        color = failColor.toString(16)

        embed.setColor(color)
        embed.setDescription(output)
      } else {
        // Adding
        flag = true
        user.roles.add(roleId); 
          
        color = successColor.toString(16)

        embed.setColor(color)
        embed.addFields(
          { name: 'Gave', value: `<@&1095767610622214225>`, inline: true },
          { name: 'to:', value: `<@${user.id}>`, inline: true }
        )
      }

      await interaction.reply({ embeds: [embed] });
    }
    catch(error){
        console.error(error);
        await interaction.reply({ content: `An error occurred:\n\n${error}`, ephemeral: true });
    }
  },
};