require("dotenv/config")

module.exports = {
      async execute(interaction, client, guild) {
      try{
        const MessageToSay = interaction.options.getString('message');
        if(interaction.user.id != '163547278882111488'){
            interaction.reply({content: 'Sorry, i can\'t do it', ephemeral:true})
        }
        else{
            interaction.channel.send(MessageToSay)
            interaction.reply({content: `Done!`, ephemeral:true})
        }
      }
      catch(error){
        interaction.reply({content: error.message, ephemeral:true})
      }
    },
  };