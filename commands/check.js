const { EmbedBuilder } = require("discord.js")
require("dotenv/config")

module.exports = {
      async execute(interaction, client, guild) {
      try{
        await interaction.deferReply({});

        const userOption1 = interaction.options.getUser('user1');
        const member = interaction.guild.members.cache.get(userOption1.id);
        const champions = ['1097200827485130792', '1097200822196109534', '1097200811295121418', '1097200228156846090', '971450716222795907', '839921732232151110']
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

        if ( outputHaving !== '' && outputChampions !== '') { output = outputHaving + '\n **Missing roles**:\n' + outputNotHaving + '\n **Winner roles**:\n' + outputChampions}
        else if (outputHaving !== '' && outputChampions == '') { output = outputHaving + '\n **Missing roles**:\n' + outputNotHaving }
        else if (outputHaving == '' && outputChampions !== '') { output = '\n **Winner roles**:\n' + outputChampions }
        else {output = `**<@${member.id}> doesn't have event roles**`}


        EventEmbed = new EmbedBuilder()
        .setColor(member.displayHexColor)
        .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL(),})
        .setDescription(output)
        .setTimestamp()
        .setFooter({text: member.id});

        interaction.editReply({embeds: [EventEmbed]})
      }
      catch(error){
        interaction.editReply(`<@163547278882111488>\n${error.message}`)
      }
    },
  };