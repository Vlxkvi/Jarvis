const { EmbedBuilder, TextInputBuilder } = require("discord.js");
const fs = require('fs')
const path = require('path');
const newsMessagePath = path.resolve(__dirname, '../functions/newsMessage.js');
const { newsMessage } = require(newsMessagePath);
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      const newsChannelId = '795155910153469952';
      const messageId = interaction.options.getString('messageid');
      const channel = interaction.guild.channels.cache.get(newsChannelId);
      const cachedMessage = await channel.messages.fetch(messageId);
      
      CompleteNewsMessage = await newsMessage(cachedMessage.content)

      const newsEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(CompleteNewsMessage)
        .setThumbnail('https://c.tenor.com/5c9rqMKtDeEAAAAi/stickergiant-sale.gif')
        .setFooter({ text: '*нажав на название машины, вы перейдёте на её страницу в интернете', iconURL: 'https://c.tenor.com/ulin4ZJ8QcYAAAAi/la-gringa-la-sole.gif'});
      interaction.reply({ embeds: [newsEmbed], files: ['1Storage/OriginalNews.txt','1Storage/News.txt']});
            
    } catch (err) {
      console.log(err);
      interaction.reply({ content: `Seems you're trying to load message which is not from <#795155910153469952> or we have some other error. Anyway tell that to <@163547278882111488> if you have this problem few times\n\nError:\n${error.message}`, ephemeral: true });
      }
  },
};