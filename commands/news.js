const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
require("dotenv/config");

module.exports = {
  async execute(interaction) {
    try {
      const Titles = {
        'FREE VEHICLES': 'empty',
        'NEW CONTENT': 'empty',
        'BONUS': 'empty',
        'TEST RIDES': 'empty',
        '3X GTA$ & RP': 'empty',
        '3X GTA$, RP & LS CAR MEET REP': 'empty',
        '2X GTA$ & RP': 'empty',
        '1.5X GTA$ & RP': 'empty',
        '2X SPEED': 'empty',
        'DISCOUNTS (50% off)': 'empty',
        'DISCOUNTS (40% off)': 'empty',
        'DISCOUNTS (30% off)': 'empty',
        'DISCOUNTS (25% off)': 'empty',
        'DISCOUNTS (20% off)': 'empty',
      };
      const ignoreTitles = ['PREMIUM RACE & WEEKLY TRIALS'];
      const newsChannelId = '795155910153469952';
      const messageId = interaction.options.getString('messageid');
      const channel = interaction.guild.channels.cache.get(newsChannelId);
      const cachedMessage = await channel.messages.fetch(messageId);
      const lines = cachedMessage.content.split("\n");
      let foundTitles = [];
      let linesCount = 0;
      
      // Checking all the lines if they are titles
      lines.forEach((line) => {
        if (line.startsWith('### ')) {
          const title = line.replace('### ', '');
    
          // Checking if we should ignore this title
          const shouldIgnore = ignoreTitles.some( (ignoreTitle) => title.includes(ignoreTitle) );    
          if (shouldIgnore) { return; }
          
          // Checking if the title exist as key is in the "Titles" dictionary          
          if (title in Titles){
            foundTitles.push(`\n${title} on ${linesCount} line`)
            let discountGroup = '';
            let testingLineCount = linesCount + 1
            let testingLine = lines[testingLineCount]

            // Creating and updating "discountGroup" variable to set it as value to its title key in "Titles" dictionary
            while(!testingLine.startsWith('### ')){
              discountGroup += `${testingLine.replace('-', '─')}\n`
              testingLineCount++;
              testingLine = lines[testingLineCount]
            }
            Titles[title] = discountGroup
            
          } else { foundTitles.push(`\n${title} -       not found`) }
        }
        linesCount++ ;
      });


      console.log(Titles)
      console.log(`\n---------------\nFound titles: ${foundTitles}`)
      interaction.reply({ content: '```' + cachedMessage.content + '```', ephemeral: true });
    } catch (error) {
      console.error(`ERROR IN NEWS COMMAND: ${error.message}`);
      interaction.reply({ content: `Seems you're trying to load message which is not from <#795155910153469952> or we have some other error. Anyway tell that to <@163547278882111488> if you have this problem few times`, ephemeral: true });
    }
  },
};
