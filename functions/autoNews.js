const { EmbedBuilder } = require("discord.js");
const fs = require('fs')

async function autoNews(messageContent, client){
  const notificationChannel = await client.channels.fetch('729263612874588160');
  const Titles = {
    'Something new': 'empty',
    'FREE VEHICLES': 'empty',
    'NEW CONTENT': 'empty',
    'BONUS': 'empty',
    'TEST RIDES': 'empty',
    '3X GTA$ & RP': 'empty',
    '3X GTA$, RP & LS CAR MEET REP': 'empty',
    '2X GTA$ & RP': 'empty',
    '1.5X GTA$ & RP': 'empty',
    '2X SPEED': 'empty',
    '2X': 'empty',
    'DISCOUNTS (50% off)': 'empty',
    'DISCOUNTS (40% off)': 'empty',
    'DISCOUNTS (30% off)': 'empty',
    'DISCOUNTS (25% off)': 'empty',
    'DISCOUNTS (20% off)': 'empty',
    'PREMIUM RACE & WEEKLY TRIALS': 'empty',
  };
  const lines = messageContent.split("\n");
  let notFoundTitles = [];
  let linesCount = 0;

  lines[1] = '### Something new'

  // Checking all the lines if they are titles
  lines.forEach((line) => {
    if (line.startsWith('### ')) {
      let title = line.replace('### ', '')
      title = title.replaceAll(`*`,``)
      
      // Checking if the title exist as key is in the "Titles" dictionary     
      let discountGroup = '';
      let testingLinesCount = linesCount + 1
      let testingLine = lines[testingLinesCount]
      // Creating and updating "discountGroup" variable to set it as value to its title key in "Titles" dictionary
      while(testingLinesCount < lines.length && !testingLine.startsWith('### ')){
        discountGroup += `${testingLine}\n`
      
        testingLinesCount++;
        testingLine = lines[testingLinesCount]
      }
      if(title in Titles){
        Titles[title] = discountGroup
      } else {
        notFoundTitles.push({
          key: title,
          value: discountGroup
        })
      }
      
    }
    linesCount++ ;
  });

  let CompleteNewsMessage = '';

  // Working with Free Vehicles
  let content = Titles['FREE VEHICLES'].split('\n')

  // Working with Free Vehicles (Casino reward)
  let FullCarNameCasino = content[0].replaceAll('*', '')
  FullCarNameCasino = FullCarNameCasino.replace('- The Lucky Wheel Podium Vehicle: ', '')
  if(FullCarNameCasino.includes('(')){
    FullCarNameCasino = FullCarNameCasino.slice(0, FullCarNameCasino.indexOf('('))
  }
  let completeCasinoReward = `─ [${FullCarNameCasino.trim()}](https://gta.fandom.com/wiki/${makeALink(FullCarNameCasino)})`
  CompleteNewsMessage += `► Транспорт на подиуме казино:\n${completeCasinoReward}\n\n`

  // Working with Free Vehicles (AutoClub reward)
  let AutoClubContent = content[1].replaceAll("*", '');
  AutoClubContent = AutoClubContent.replace('- LS Car Meet Prize Ride: ','')
  let autoClubParts = AutoClubContent.split(' - ');
  let FullCarNameAutoClub = autoClubParts[0].substring(0, autoClubParts[0].indexOf('('))
  let completeAutoClubReward = `─ [${FullCarNameAutoClub.trim()}](https://gta.fandom.com/wiki/${makeALink(FullCarNameAutoClub)})`;
  CompleteNewsMessage += `► Транспорт в автоклубе:\n${completeAutoClubReward}\n\n`
  let ChallangeAutoClub = `─ ${autoClubParts[1].trim()}`
    
  ChallangeAutoClub = ChallangeAutoClub
    .replace("Place Top ", "Займите Топ-")
    .replace("in the LS Car Meet Series for", "в гонках серии Автоклуба ЛС")
    .replace("days in a row", "дня подряд");
    
  CompleteNewsMessage += `► Испытание:\n${ChallangeAutoClub}\n\n`
  
  // Working with something new
  if(Titles['Something new'] != 'empty'){
    CompleteNewsMessage += `► Что-то новенькое:\n${Titles['Something new'].replaceAll('-','─')}\n`
  }

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
  let PremiumDeluxe = content[0].replaceAll('*','').replace('- Premium Deluxe Motorsport: ','')
  let PremiumDeluxeCars = PremiumDeluxe.split(/[,&]+/)
  let completePremiumDeluxe = '';
  PremiumDeluxeCars.forEach((line) => { 
    completePremiumDeluxe += `─ [${line.trim()}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
  })
  CompleteNewsMessage += `► Транспорт в Premium Deluxe Motorsport:\n${completePremiumDeluxe}\n`

  // Working with Test Rides (Luxury Autos)
  let LuxuryAutos = content[1].replaceAll('*','').replace('- Luxury Autos: ','')
  let LuxuryAutosCars = LuxuryAutos.split(' & ')
  let completeLuxuryAutos = '';
  LuxuryAutosCars.forEach((line) => {
    completeLuxuryAutos += `─ [${line.trim()}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
  })
  CompleteNewsMessage += `► Транспорт в Luxury Autos:\n${completeLuxuryAutos}\n`

  // Working with Test Rides (Test Track (LS Car Meet))
  let TestTrack = content[2].replaceAll('*','').replace('- Test Track (LS Car Meet): ','')
  let TestTrackCars = TestTrack.split(/[,&]+/)
  let completeTestTrack = '';
  TestTrackCars.forEach((line) => {
    completeTestTrack += `─ [${line.trim()}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
  })
  CompleteNewsMessage += `► Транспорт для тестовой трассы:\n${completeTestTrack}\n`

  // Working with Test Rides (Premium Test Ride (HSW))
  let TestRideHSW = content[3].replaceAll('*','').replace('- Premium Test Ride (HSW): ','')
  let completeTestRideHSW = `─ [${TestRideHSW}](https://gta.fandom.com/wiki/${makeALink(TestRideHSW)})`
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
  if(Titles['2X'] != 'empty'){ 
    CompleteNewsMessage += `► 2X :\n${Titles['2X'].replace(/- /g, '─ ')}\n` 
  }

  // Working with discounts
  if(Titles['DISCOUNTS (50% off)'] != 'empty'){
    let discounts50 = Titles['DISCOUNTS (50% off)'].slice(0, -1)
    let complete50Discounts = '';
    discounts50 = discounts50.split('\n')
    discounts50.forEach((line => {
      complete50Discounts += `─ [${line.replace('- ','')}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
    }))
    CompleteNewsMessage += `► Скидка 50% на:\n${complete50Discounts}\n`
  }
  if(Titles['DISCOUNTS (40% off)'] != 'empty'){
    let discounts40 = Titles['DISCOUNTS (40% off)'].slice(0, -1)
    let complete40Discounts = '';
    discounts40 = discounts40.split('\n')
    discounts40.forEach((line => {
      complete40Discounts += `─ [${line.replace('- ','')}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
    }))
    CompleteNewsMessage += `► Скидка 40% на:\n${complete40Discounts}\n`
  }
  if(Titles['DISCOUNTS (30% off)'] != 'empty'){
    let discounts30 = Titles['DISCOUNTS (30% off)'].slice(0, -1)
    let complete30Discounts = '';
    discounts30 = discounts30.split('\n')
    discounts30.forEach((line => {
      complete30Discounts += `─ [${line.replace('- ','')}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
    }))
    CompleteNewsMessage += `► Скидка 30% на:\n${complete30Discounts}\n`
  }
  if(Titles['DISCOUNTS (25% off)'] != 'empty'){
    let discounts25 = Titles['DISCOUNTS (25% off)'].slice(0, -1)
    let complete25Discounts = '';
    discounts25 = discounts25.split('\n')
    discounts25.forEach((line => {
      complete25Discounts += `─ [${line.replace('- ','')}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
    }))
    CompleteNewsMessage += `► Скидка 25% на:\n${complete25Discounts}\n`
  }
  if(Titles['DISCOUNTS (20% off)'] != 'empty'){
    let discounts20 = Titles['DISCOUNTS (20% off)'].slice(0, -1)
    let complete20Discounts = '';
    discounts20 = discounts20.split('\n')
    discounts20.forEach((line => {
      complete20Discounts += `─ [${line.replace('- ','')}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
    }))
    CompleteNewsMessage += `► Скидка 20% на:\n${complete20Discounts}\n`
  }
  
  if (Object.keys(notFoundTitles).length !== 0) {
    CompleteNewsMessage += `NOT FOUND:\n\n`
    notFoundTitles.forEach((title) => {
      CompleteNewsMessage += `► ${title.key}:\n${title.value.replaceAll('-','─')}`
    })
  }

  fs.writeFile('1Storage/OriginalNews.txt', messageContent, (err) => {
    if (err) {
        console.error('Помилка при збереженні файлу:', err);
        return;
    }
  })

  fs.writeFile('1Storage/News.txt', CompleteNewsMessage, (err) => {
    if (err) {
        console.error('Помилка при збереженні файлу:', err);
        return;
    }
  })

  const newsEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setDescription(CompleteNewsMessage)
    .setThumbnail('https://c.tenor.com/5c9rqMKtDeEAAAAi/stickergiant-sale.gif')
    .setFooter({ text: '*нажав на название машины, вы перейдёте на её страницу в интернете', iconURL: 'https://c.tenor.com/ulin4ZJ8QcYAAAAi/la-gringa-la-sole.gif'});
  notificationChannel.send({ embeds: [newsEmbed], files: ['1Storage/OriginalNews.txt','1Storage/News.txt']});
}

module.exports = {
  autoNews
};

function makeALink(line){
    line = line.replace('- ','')
    line = line.trim()
    words = line.split(' ')
    words.shift()
    model = words.join('_')
    return model;
  }