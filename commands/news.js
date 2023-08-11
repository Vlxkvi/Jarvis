const { Console } = require("console");const { EmbedBuilder } = require("discord.js");
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
        'PREMIUM RACE & WEEKLY TRIALS': 'empty',
      };
      const newsChannelId = '795155910153469952';
      const messageId = interaction.options.getString('messageid');
      const channel = interaction.guild.channels.cache.get(newsChannelId);
      const cachedMessage = await channel.messages.fetch(messageId);
      const lines = cachedMessage.content.split("\n");
      lines.push('### ')
      let notFoundTitles = [];
      let linesCount = 0;

      // Checking all the lines if they are titles
      lines.forEach((line) => {
        if (line.startsWith('### ')) {
          const title = line.replace('### ', '')
          
          // Checking if the title exist as key is in the "Titles" dictionary          
          if (title in Titles){
            let discountGroup = '';
            let testingLineCount = linesCount + 1
            let testingLine = lines[testingLineCount]

            // Creating and updating "discountGroup" variable to set it as value to its title key in "Titles" dictionary
            while(!testingLine.startsWith('### ')){
              discountGroup += `${testingLine}\n`
            
              testingLineCount++;
              testingLine = lines[testingLineCount]
            }
            Titles[title] = discountGroup
            
          } else { 
            notFoundTitles.push(`${title}`)

          }
        }
        linesCount++ ;
      });


      let CompleteNewsMessage = '';

      // Working with Free Vehicles
      let content = Titles['FREE VEHICLES'].split('\n')

      // Working with Free Vehicles (Casino reward)
      let FullCarNameCasino = content[0].replace('- **The Lucky Wheel Podium Vehicle:** ', '')
      FullCarNameCasino = FullCarNameCasino.substring(0, FullCarNameCasino.indexOf('(')).trim()
      let words = FullCarNameCasino.split(' ')
      words.shift()
      let model = words.join('_')
      let completeCasinoReward = `─ [${FullCarNameCasino}](https://gta.fandom.com/wiki/${model})`
      CompleteNewsMessage += `► Транспорт на подиуме казино:\n${completeCasinoReward}\n\n`

      // Working with Free Vehicles (AutoClub reward)
      let AutoClubContent = content[1].replace('- **LS Car Meet Prize Ride:** ','');
      let autoClubParts = AutoClubContent.split(' - ');
      let FullCarNameAutoClub = autoClubParts[0].substring(0, autoClubParts[0].indexOf('(')).trim();
      words = FullCarNameAutoClub.split(' ');
      words.shift();
      model = words.join('_');
      let completeAutoClubReward = `─ [${FullCarNameAutoClub}](https://gta.fandom.com/wiki/${model})`;
      CompleteNewsMessage += `► Транспорт в автоклубе:\n${completeAutoClubReward}\n\n`
      let ChallangeAutoClub = `─ ${autoClubParts[1].trim()}`
      CompleteNewsMessage += `► Испытание:\n${ChallangeAutoClub}\n\n`

      // Working with New Content
      if(Titles['NEW CONTENT'] != 'empty'){
        CompleteNewsMessage += `► Новый контент:\n${Titles['NEW CONTENT'].replace(/- /g, '─ ')}\n`
      }
      
      // Working with Bonus
      if(Titles['BONUS'] != 'empty'){
        CompleteNewsMessage += `► Бонусы:\n${Titles['BONUS'].replace(/- /g, '─ ')}\n`
      }

      // Working with Test Rides
      content = Titles['TEST RIDES'].split('\n')

      // Working with Test Rides (Premium Deluxe Motorsport)
      let PremiumDeluxe = content[0].replace('- Premium Deluxe Motorsport: ','')
      let PremiumDeluxeCars = PremiumDeluxe.split(/[,&]+/)
      let completePremiumDeluxe = '';
      PremiumDeluxeCars.forEach((line) => { 
        line = line.trim()
        words = line.split(' ')
        words.shift()
        model = words.join('_')
        completePremiumDeluxe += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
      })
      CompleteNewsMessage += `► Транспорт в Premium Deluxe Motorsport:\n${completePremiumDeluxe}\n`

      // Working with Test Rides (Luxury Autos)
      let LuxuryAutos = content[1].replace('- Luxury Autos: ','')
      let LuxuryAutosCars = LuxuryAutos.split(' & ')
      let completeLuxuryAutos = '';
      LuxuryAutosCars.forEach((line) => {
        line = line.trim()
        words = line.split(' ')
        words.shift()
        model = words.join('_')
        completeLuxuryAutos += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
      })
      CompleteNewsMessage += `► Транспорт в Luxury Autos:\n${completeLuxuryAutos}\n`

      // Working with Test Rides (Test Track (LS Car Meet))
      let TestTrack = content[2].replace('- Test Track (LS Car Meet): ','')
      let TestTrackCars = TestTrack.split(/[,&]+/)
      let completeTestTrack = '';
      TestTrackCars.forEach((line) => {
        line = line.trim()
        words = line.split(' ')
        words.shift()
        model = words.join('_')
        completeTestTrack += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
      })
      CompleteNewsMessage += `► Транспорт для тестовой трассы:\n${completeTestTrack}\n`

      // Working with Test Rides (Premium Test Ride (HSW))
      let TestRideHSW = content[3].replace('- Premium Test Ride (HSW): ','')
      let completeTestRideHSW = '';
      TestRideHSW.trim()
      words = TestRideHSW.split(' ')
      words.shift()
      model = words.join('_')
      completeTestRideHSW += `─ [${TestRideHSW}](https://gta.fandom.com/wiki/${model})`
      CompleteNewsMessage += `► Тестовая машина HSW:\n${completeTestRideHSW}\n\n`

      // Working with ..X Bonuses
      if(Titles['3X GTA$ & RP'] != 'empty'){ 
        CompleteNewsMessage += `► 3X GTA$, RP:\n${Titles['3X GTA$ & RP'].replace(/- /g, '─ ')}\n` 
      }
      if(Titles['3X GTA$, RP & LS CAR MEET REP'] != 'empty'){ 
        CompleteNewsMessage += `► Х3 GTA$, RP, Опыт автоклуба:\n${Titles['3X GTA$, RP & LS CAR MEET REP'].replace(/- /g, '─ ')}\n` 
      }
      if(Titles['2X GTA$ & RP'] != 'empty'){ 
        CompleteNewsMessage += `► 2X GTA$, RP:\n${Titles['2X GTA$ & RP'].replace(/- /g, '─ ')}\n` 
      }
      if(Titles['1.5X GTA$ & RP'] != 'empty'){ 
        CompleteNewsMessage += `► 1.5X GTA$, RP:\n${Titles['1.5X GTA$ & RP'].replace(/- /g, '─ ')}\n`
      }
      if(Titles['2X SPEED'] != 'empty'){ 
        CompleteNewsMessage += `► 2X скорость:\n${Titles['2X SPEED'].replace(/- /g, '─ ')}\n` 
      }

      // Working with discounts
      if(Titles['DISCOUNTS (50% off)'] != 'empty'){
        let discounts50 = Titles['DISCOUNTS (50% off)'].slice(0, -1)
        let complete50Discounts = '';
        discounts50 = discounts50.split('\n')
        discounts50.forEach((line => {
          line = line.trim()
          line = line.replace('- ','')
          words = line.split(' ')
          words.shift()
          model = words.join('_')
          complete50Discounts += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
        }))
        CompleteNewsMessage += `► Скидка 50% на:\n${complete50Discounts}\n`
      }
      if(Titles['DISCOUNTS (40% off)'] != 'empty'){
        let discounts40 = Titles['DISCOUNTS (40% off)'].slice(0, -1)
        let complete40Discounts = '';
        discounts40 = discounts40.split('\n')
        discounts40.forEach((line => {
          line = line.trim()
          line = line.replace('- ','')
          words = line.split(' ')
          words.shift()
          model = words.join('_')
          complete40Discounts += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
        }))
        CompleteNewsMessage += `► Скидка 40% на:\n${complete40Discounts}\n`
      }
      if(Titles['DISCOUNTS (30% off)'] != 'empty'){
        let discounts30 = Titles['DISCOUNTS (30% off)'].slice(0, -1)
        let complete30Discounts = '';
        discounts30 = discounts30.split('\n')
        discounts30.forEach((line => {
          line = line.trim()
          line = line.replace('- ','')
          words = line.split(' ')
          words.shift()
          model = words.join('_')
          complete30Discounts += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
        }))
        CompleteNewsMessage += `► Скидка 30% на:\n${complete30Discounts}\n`
      }
      if(Titles['DISCOUNTS (25% off)'] != 'empty'){
        let discounts25 = Titles['DISCOUNTS (25% off)'].slice(0, -1)
        let complete25Discounts = '';
        discounts25 = discounts25.split('\n')
        discounts25.forEach((line => {
          line = line.trim()
          line = line.replace('- ','')
          words = line.split(' ')
          words.shift()
          model = words.join('_')
          complete25Discounts += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
        }))
        CompleteNewsMessage += `► Скидка 25% на:\n${complete25Discounts}\n`
      }
      if(Titles['DISCOUNTS (20% off)'] != 'empty'){
        let discounts20 = Titles['DISCOUNTS (20% off)'].slice(0, -1)
        let complete20Discounts = '';
        discounts20 = discounts20.split('\n')
        discounts20.forEach((line => {
          line = line.trim()
          line = line.replace('- ','')
          words = line.split(' ')
          words.shift()
          model = words.join('_')
          complete20Discounts += `─ [${line}](https://gta.fandom.com/wiki/${model})\n`
        }))
        CompleteNewsMessage += `► Скидка 20% на:\n${complete20Discounts}\n`
      }

      if(notFoundTitles.length != 1){
        notFoundTitles.forEach((title) => {
          CompleteNewsMessage += `Not found ${title}`
        })
      }


      const newsEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(CompleteNewsMessage)
        .setThumbnail('https://c.tenor.com/5c9rqMKtDeEAAAAi/stickergiant-sale.gif')
        .setFooter({ text: '*нажав на название машины, вы перейдёте на её страницу в интернете', iconURL: 'https://c.tenor.com/ulin4ZJ8QcYAAAAi/la-gringa-la-sole.gif'});
      interaction.reply({ embeds: [newsEmbed] });
    } catch (error) {
      console.error(`ERROR IN NEWS COMMAND: ${error.message}`);
      interaction.reply({ content: `Seems you're trying to load message which is not from <#795155910153469952> or we have some other error. Anyway tell that to <@163547278882111488> if you have this problem few times`, ephemeral: true });
    }
  },
};
//- **LS Car Meet Prize Ride:** Pegassi Toros (<https://youtu.be/YiTpEGha81k?t=18>) - Place Top 5 in the LS Car Meet Series three days in a row'
