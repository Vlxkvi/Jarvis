const { EmbedBuilder } = require("discord.js");
const { eventRoles, champions } = require("../oftenused.js")
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      await interaction.deferReply({});

      const userOption1 = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(userOption1.id);
      
      let outputStatus = '';
      let championNumber = -1;
      let hasAllRoles = true;

      for (let step = 0; step < 10; step++) {
        if (!member.roles.cache.find(role => role.id == eventRoles[step])) {
          outputStatus = `<@${member.id}> doesn't have all required roles`;
          hasAllRoles = false;
          break;
        }
      }

      if (hasAllRoles) {
        //Checking champion role
        for (let step = 0; step < 5; step++) {
          if (member.roles.cache.find(role => role.id == champions[step])) {
            championNumber = step;
            break;
          }
        }

        //Removing 10 event roles
        await Promise.all(eventRoles.map(roleId => member.roles.remove(roleId)));

        //Adding champion
        await member.roles.add(champions[championNumber + 1]);

        //making output message
        outputStatus = `<@${member.id}>\n**Added** <@&${champions[championNumber + 1]}>`;

        //Checking if member had any champion role, it gets removed
        if (championNumber != -1) {
          await member.roles.remove(champions[championNumber]);
          outputStatus += ` \n**Removed** <@&${champions[championNumber]}>`;
        }

      }

      const EventEmbed = new EmbedBuilder()
        .setColor(member.displayHexColor)
        .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
        .setDescription(outputStatus)
        .setTimestamp()
        .setFooter({ text: member.id });

      await interaction.editReply({ embeds: [EventEmbed] });
    } catch (error) {
      console.error(error);
    }
  },
};
