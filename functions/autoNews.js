const { EmbedBuilder } = require("discord.js");
const fs = require('fs')
const path = require('path');
const newsMessagePath = path.resolve(__dirname, '../functions/newsMessage.js');
const { newsMessage } = require(newsMessagePath);

async function autoNews(messageContent, client){
  const notificationChannel = await client.channels.fetch('729263612874588160');
  
  CompleteNewsMessage = await newsMessage(messageContent)

  /*const newsEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setDescription(CompleteNewsMessage)
    .setThumbnail('https://c.tenor.com/5c9rqMKtDeEAAAAi/stickergiant-sale.gif')
    .setFooter({ text: '*нажав на название машины, вы перейдёте на её страницу в интернете', iconURL: 'https://c.tenor.com/ulin4ZJ8QcYAAAAi/la-gringa-la-sole.gif'});
  notificationChannel.send({ embeds: [newsEmbed], files: ['1Storage/OriginalNews.txt','1Storage/News.txt']});*/
  notificationChannel.send({ files: ['1Storage/OriginalNews.txt','1Storage/News.txt']});
}

module.exports = {
  autoNews
};