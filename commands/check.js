const { EmbedBuilder } = require("discord.js")
const { eventRoles, champions, mainColor } = require("../oftenused.js")
require("dotenv/config")

module.exports = {
      async execute(interaction, client) {
      try{
        await interaction.deferReply({});
        const userOption1 = interaction.options.getUser('user1');
        const member = interaction.guild.members.cache.get(userOption1.id);
        
        outputHaving = ''
        outputNotHaving = ''
        outputChampions = ''
        
        for(let step = 0; step<10; step++){
            if(member.roles.cache.find(role => role.id == eventRoles[step])){
              outputHaving = outputHaving + `<@&${eventRoles[step]}>\n`} 
            else{ outputNotHaving = outputNotHaving + `<@&${eventRoles[step]}>\n` }
        }

        for(let step = 0; step<6; step++){
          if(member.roles.cache.find(role => role.id == champions[step])){
            outputChampions = outputChampions + `<@&${champions[step]}>\n`}
        }

        EventEmbed = new EmbedBuilder()
        .setColor(member.displayHexColor)
        .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL(),})
        .setTimestamp()
        .addFields(
          { name: 'Having', value: outputHaving ? outputHaving : '-', inline: true },
          { name: 'Missing', value: outputNotHaving ? outputNotHaving : '-', inline: true },
          { name: 'Champions', value: outputChampions ? outputChampions : '-', inline: true }
        )
        .setFooter({text: member.id});

        interaction.editReply({embeds: [EventEmbed]})
      }
      catch(error){
        interaction.editReply(`<@163547278882111488>\n${error.message}`)
      }
    },
  };