const { EmbedBuilder, time } = require("discord.js");
const { successColor, failColor, midColor } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
    try{
        const itemNameOption = interaction.options.getString(`name`)
        const roleNameOption = interaction.options.getString(`emoji`)
        const priceOption = interaction.options.getInteger(`price`)

        const roleToPosition = interaction.guild.roles.cache.get('838120897792442418');
        const newRole = await interaction.guild.roles.create({
            name: roleNameOption, 
            color: '#fdab9f'
        });

        // Переміщуємо нову роль вище заданої ролі
        await newRole.setPosition(roleToPosition.position);

        let output = `Created role <@&${newRole.id}>\n` +
        `\`\`\`$create-item ${itemNameOption}\`\`\`` + 
        `\`\`\`$edit-item Description ${itemNameOption} Выдаёт роль: <@&${newRole.id}>\n\`$buy-item ${itemNameOption}\`\n\`\`\`` + 
        `\`\`\`$edit-item role ${itemNameOption} <@&${newRole.id}>\`\`\`` +
        `\`\`\`$edit-item price ${itemNameOption} ${priceOption}\`\`\`` +
        `\`\`\`$edit-item inventory ${itemNameOption} no\`\`\``
        
        let color = successColor 

        embed.setTitle(`Succesfully done!`)
        embed.setDescription(output)
        embed.setColor(color)
        await interaction.reply({ embeds: [embed] });
      }
      catch(error){
        console.error(error);

        embed.setTitle(`Error!`)
        embed.setDescription(error)
        embed.setColor(failColor)
        await interaction.reply({ embeds: [embed] });
      }
  },
};