const { EmbedBuilder } = require("discord.js")
require("dotenv/config")

module.exports = {
      async execute(interaction, client, guild) {
      try{
        await interaction.deferReply({});

        const userOption1 = interaction.options.getUser('user1');
        const member = interaction.guild.members.cache.get(userOption1.id);
        const champions = ['1097200827485130792', '1097200822196109534', '1097200811295121418', '1097200228156846090', '971450716222795907']
        const roles = ['841224405873852418', '839921943997186059', '886512881464639539', '839921953111670784', '841692259970711584', '971450698539618354', '860929131347705887', '884091649674846238', '971450704197722192', '839921953896792105'];
    
        outputHaving = ''
        outputNotHaving = ''
        outputChampions = ''
        
        for(let step = 0; step<10; step++){
            if(member.roles.cache.find(role => role.id == roles[step])){
              outputHaving = outputHaving + `<@&${roles[step]}>\n`} 
            else{ outputNotHaving = outputNotHaving + `<@&${roles[step]}>\n` }
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