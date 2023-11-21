const { EmbedBuilder } = require("discord.js");
require("dotenv/config");

module.exports = {
  async execute(interaction, client, guild) {
    try {
      await interaction.deferReply({});

      const userOption1 = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(userOption1.id);
      const champions = ['971450716222795907', '1097200228156846090', '1097200811295121418', '1097200822196109534', '1097200827485130792']
      const roles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];

      let outputStatus = '';
      let championNumber = -1;
      let hasAllRoles = true;

      for (let step = 0; step < 10; step++) {
        if (!member.roles.cache.find(role => role.id == roles[step])) {
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
        await Promise.all(roles.map(roleId => member.roles.remove(roleId)));

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
