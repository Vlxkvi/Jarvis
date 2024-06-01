const fs = require("fs")

async function newsMessage(messageContent){
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
        'WEEKLY CHALLENGE': 'empty',
        'SALVAGE YARD ROBBERIES': 'empty',
        'GUN VAN PRIMARY DISCOUNTS': 'empty',
      };
      const lines = messageContent.split("\n");
      let notFoundTitles = [];
      let linesCount = 0;
      
      if(lines[1] == ``){
        lines[1] = '### Something new'
      }

      // Checking all the lines if they are titles
      lines.forEach((line) => {
        if (line.startsWith('#')) {
          let title = line.replaceAll('#', '').replaceAll(`*`,``).trim()
          
          // Checking if the title exist as key is in the "Titles" dictionary     
          let discountGroup = '';
          let testingLinesCount = linesCount + 1
          let testingLine = lines[testingLinesCount]
          // Creating and updating "discountGroup" variable to set it as value to its title key in "Titles" dictionary
          while(testingLinesCount < lines.length && !testingLine.startsWith('#')){
            
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
      let ErrorsList = ``
    
      // Working with Free Vehicles
      let content = Titles['FREE VEHICLES'].split('\n')
    
      // Working with Free Vehicles (Casino reward)
      try{
        let FullCarNameCasino = content[0]
        .replaceAll('*', '')
        .replace('- The Lucky Wheel Podium Vehicle: ', '')
        .replace('[', '')
        .replace(']','')
        if(FullCarNameCasino.includes('(')){
          FullCarNameCasino = FullCarNameCasino.slice(0, FullCarNameCasino.indexOf('('))
        }
        let completeCasinoReward = `─ [${FullCarNameCasino.trim()}](https://gta.fandom.com/wiki/${makeALink(FullCarNameCasino)})`
        CompleteNewsMessage += `► Транспорт на подиуме казино:\n${completeCasinoReward}\n\n`
      }
      catch(err){
        ErrorsList += `FullCarNameCasino:\n${err}\n\n`
      }
    
      // Working with Free Vehicles (AutoClub reward)
      try{
        let AutoClubContent = content[1]
        .replaceAll("*", '')
        .replace('- LS Car Meet Prize Ride: ','')
        .replace('[', '')
        .replace(']','');
        let autoClubParts = AutoClubContent.split(' - ');
        let FullCarNameAutoClub = autoClubParts[0].substring(0, autoClubParts[0].indexOf('('))
        let completeAutoClubReward = `─ [${FullCarNameAutoClub.trim()}](https://gta.fandom.com/wiki/${makeALink(FullCarNameAutoClub)})`;
        CompleteNewsMessage += `► Транспорт в автоклубе:\n${completeAutoClubReward}\n\n`
        let ChallangeAutoClub = `─ ${autoClubParts[1].trim()}`
        
        ChallangeAutoClub = ChallangeAutoClub
          .replace("Place Top ", "Займите Топ-")
          .replace("in the LS Car Meet Series", "в гонках серии Автоклуба ЛС")
          .replace("days in a row", "дня подряд");
          
        CompleteNewsMessage += `► Испытание:\n${ChallangeAutoClub}\n\n`
      }
      catch(err){
        ErrorsList += `FullCarNameCasino:\n${err}\n\n`
      }

      // Working with Weekly challenge
      if(Titles['WEEKLY CHALLENGE'] != 'empty'){
        CompleteNewsMessage += `► Недельное испытание:\n${Titles['WEEKLY CHALLENGE']}\n`
      }
      
      // Working with something new
      if(Titles['Something new'] != 'empty'){
        CompleteNewsMessage += `► Что-то новенькое:\n${Titles['Something new']}\n`
      }
    
      // Working with New Content
      if(Titles['NEW CONTENT'] != 'empty'){
        CompleteNewsMessage += `► Новый контент:\n${Titles['NEW CONTENT']}\n`
      }
      
      // Working with Bonus
      if(Titles['BONUS'] != 'empty'){
        CompleteNewsMessage += `► Бонусы:\n${Titles['BONUS']}\n`
      }
    
      // Working with Test Rides
      content = Titles['TEST RIDES'].split('\n')
    
      // Working with Test Rides (Premium Deluxe Motorsport)
      let PremiumDeluxe = content[0]
        .replaceAll('*','')
        .replace('- Premium Deluxe Motorsport: ','')
      let PremiumDeluxeCars = PremiumDeluxe.split(/[,&]+/)
      let completePremiumDeluxe = '';
      PremiumDeluxeCars.forEach((line) => { 
        completePremiumDeluxe += `─ [${line.trim()}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
      })
      CompleteNewsMessage += `► Транспорт в Premium Deluxe Motorsport:\n${completePremiumDeluxe}\n`
    
      // Working with Test Rides (Luxury Autos)
      let LuxuryAutos = content[1]
        .replaceAll('*','')
        .replace('- Luxury Autos: ','')
      let LuxuryAutosCars = LuxuryAutos.split(' & ')
      let completeLuxuryAutos = '';
      LuxuryAutosCars.forEach((line) => {
        completeLuxuryAutos += `─ [${line.trim()}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
      })
      CompleteNewsMessage += `► Транспорт в Luxury Autos:\n${completeLuxuryAutos}\n`
    
      // Working with Test Rides (Test Track (LS Car Meet))
      let TestTrack = content[2]
        .replaceAll('*','')
        .replace('- Test Track (LS Car Meet): ','')
      let TestTrackCars = TestTrack.split(/[,&]+/)
      let completeTestTrack = '';
      TestTrackCars.forEach((line) => {
        completeTestTrack += `─ [${line.trim()}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
      })
      CompleteNewsMessage += `► Транспорт для тестовой трассы:\n${completeTestTrack}\n`
    
      // Working with Test Rides (Premium Test Ride (HSW))
      let TestRideHSW = content[3]
        .replaceAll('*','')
        .replace('- Premium Test Ride (HSW): ','')
      let completeTestRideHSW = `─ [${TestRideHSW}](https://gta.fandom.com/wiki/${makeALink(TestRideHSW)})`
      CompleteNewsMessage += `► Тестовая машина HSW:\n${completeTestRideHSW}\n\n`
    
      // Working with ..X Bonuses
      if(Titles['3X GTA$ & RP'] != 'empty'){
        CompleteNewsMessage += `► 3X GTA$, RP:\n${Titles['3X GTA$ & RP'].replaceAll('- ','─ ')}\n` 
      }
      if(Titles['3X GTA$, RP & LS CAR MEET REP'] != 'empty'){ 
        CompleteNewsMessage += `► Х3 GTA$, RP, Опыт автоклуба:\n${Titles['3X GTA$, RP & LS CAR MEET REP'].replaceAll('- ','─ ')}\n` 
      }
      if(Titles['2X GTA$ & RP'] != 'empty'){ 
        CompleteNewsMessage += `► 2X GTA$, RP:\n${Titles['2X GTA$ & RP'].replaceAll('- ','─ ')}\n` 
      }
      if(Titles['1.5X GTA$ & RP'] != 'empty'){ 
        CompleteNewsMessage += `► 1.5X GTA$, RP:\n${Titles['1.5X GTA$ & RP'].replaceAll('- ','─ ')}\n`
      }
      if(Titles['2X SPEED'] != 'empty'){ 
        CompleteNewsMessage += `► 2X скорость:\n${Titles['2X SPEED'].replaceAll('- ','─ ')}\n` 
      }
      if(Titles['2X'] != 'empty'){ 
        CompleteNewsMessage += `► 2X :\n${Titles['2X'].replaceAll('- ','─ ')}\n` 
      }
    
      function discountMaker(title){
        let discounts = Titles[title].slice(0, -1)
        let completeDiscounts = '';
        discounts = discounts.split('\n')
        discounts.forEach((line => {
          completeDiscounts += `─ [${line.replaceAll('- ','')}](https://gta.fandom.com/wiki/${makeALink(line)})\n`
        }))
        return completeDiscounts
      }
      // Working with discounts
      if(Titles['DISCOUNTS (50% off)'] != 'empty'){
        CompleteNewsMessage += `► Скидка 50% на:\n${discountMaker('DISCOUNTS (50% off)')}\n`
      }
      if(Titles['DISCOUNTS (40% off)'] != 'empty'){
        CompleteNewsMessage += `► Скидка 40% на:\n${discountMaker('DISCOUNTS (40% off)')}\n`
      }
      if(Titles['DISCOUNTS (30% off)'] != 'empty'){
        CompleteNewsMessage += `► Скидка 30% на:\n${discountMaker('DISCOUNTS (30% off)')}\n`
      }
      if(Titles['DISCOUNTS (25% off)'] != 'empty'){
        CompleteNewsMessage += `► Скидка 25% на:\n${discountMaker('DISCOUNTS (25% off)')}\n`
      }
      if(Titles['DISCOUNTS (20% off)'] != 'empty'){
        CompleteNewsMessage += `► Скидка 20% на:\n${discountMaker('DISCOUNTS (20% off)')}\n`
      }

      if(Titles[`GUN VAN PRIMARY DISCOUNTS`] != 'empty'){
        let GunDiscountsLines = Titles['GUN VAN PRIMARY DISCOUNTS'].split('\n')
        let discountForGun1 = GunDiscountsLines[0].split(':')[0].trim().replace('OFF','')
        let GunDiscounts1 = GunDiscountsLines[0].split(':')[1].trim()
        let discountForGun2 = GunDiscountsLines[1].split(':')[0].trim().replace('OFF for GTA+ Members','для игроков с подпиской GTA+ ')
        let GunDiscounts2 = GunDiscountsLines[1].split(':')[1].trim()

        CompleteNewsMessage += `► Скидки в оружейном фургоне:\n${discountForGun1}: [${GunDiscounts1}](https://gta.fandom.com/wiki/${GunDiscounts1.replace(' ','_')})\n${discountForGun2}: [${GunDiscounts2}](https://gta.fandom.com/wiki/${GunDiscounts2.replace(' ','_')})\n\n`
      }

      if(Titles['SALVAGE YARD ROBBERIES'] != 'empty'){
        let salvageYardRobberies = Titles['SALVAGE YARD ROBBERIES'].split('\n')
        if(salvageYardRobberies[salvageYardRobberies.length-1] == ''){ salvageYardRobberies.pop()}
        salvageoutput = []
        salvageYardRobberies.forEach(line => {
          const carInfo = line.split(':')[1];
          if (carInfo !== undefined) {
            const car = carInfo.trim();
            salvageoutput.push(line.replace(`${car}`, `[${car}](https://gta.fandom.com/wiki/${makeALink(car)})`));
          } else {
            console.log('Car info is undefined');
          }
      });

        CompleteNewsMessage += `► Ограбления Утилизационного цеха:\n${salvageoutput.join('\n')}\n\n`
      }
      
      if (Object.keys(notFoundTitles).length !== 0) {
        CompleteNewsMessage += `NOT FOUND:\n\n`
        notFoundTitles.forEach((title) => {
          CompleteNewsMessage += `► ${title.key}:\n${title.value}\n`
        })
      }
      CompleteNewsMessage = CompleteNewsMessage.replaceAll('- ','─ ')
    
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
      console.log(CompleteNewsMessage)
      return CompleteNewsMessage;
}

module.exports = {
  newsMessage
};

function makeALink(line){
    line = line.replace('- ','')
    line = line.trim()
    words = line.split(' ')
    words.shift()
    model = words.join('_')
    return model;
}