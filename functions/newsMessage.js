const fs = require("fs")

async function newsMessage(messageContent){
  try{
    const discountMap = new Map()
    const xxMap = new Map()
    const possibleX = [`GTA$`, `RP`, `SPEED`, `LS CAR MEET REP`]

    const Titles = {
        'SOMETHING NEW': 'empty',
        'FREE VEHICLES': 'empty',
        'NEW CONTENT': 'empty',
        'BONUS': 'empty',
        'TEST RIDES': 'empty',
        'XX': xxMap,
        'DISCOUNTS': discountMap,
        'PREMIUM RACE & WEEKLY TRIALS': 'empty',
        'WEEKLY CHALLENGE': 'empty',
        'SALVAGE YARD ROBBERIES': 'empty',
        'GUN VAN PRIMARY DISCOUNTS': 'empty',
        'PREMIUM RACE & TRIALS': 'empty',
        'FIB PRIORITY FILE': 'empty',
      };
      const lines = messageContent.split("\n");
      let notFoundTitles = [];
      let linesCount = 0;
      
      if(lines[1] == ``){
        lines[1] = '### SOMETHING NEW'
      }

      // Checking all the lines if they are titles
      lines.forEach((line) => {
        if (line.startsWith('#')) {
          let title = line.replaceAll('#', '').replaceAll(`*`,``).trim().toUpperCase()
          
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
            Titles[title] = discountGroup.trim()
          }
          else if(title.startsWith('DISCOUNTS')){
            discountMap.set(title,discountGroup.trim())
          }
          else if(possibleX.some(part => title.includes(part))){
            xxMap.set(title,discountGroup.trim())
          }
          else {
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
          .replace("Win", "Победите")
          .replace("the LS Car Meet Series", "в гонках серии Автоклуба ЛС")
          .replace("days in a row", "дня подряд")
          .replace("for ", "")
          .replace("in ", "")
          .replace('two', '2')
          .replace('three', '3')
          .replace('four', '4')
          .replace('five', '5')
          
        CompleteNewsMessage += `► Испытание:\n${ChallangeAutoClub}\n\n`
      }
      catch(err){
        ErrorsList += `FullCarNameCasino:\n${err}\n\n`
      }

      // Working with Weekly challenge
      if(Titles['WEEKLY CHALLENGE'] != 'empty'){
        CompleteNewsMessage += `► Недельное испытание:\n${Titles['WEEKLY CHALLENGE']}\n\n`
      }
      
      // Working with SOMETHING NEW
      if(Titles['SOMETHING NEW'] != 'empty'){
        CompleteNewsMessage += `► Что-то новенькое:\n${Titles['SOMETHING NEW']}\n\n`
      }
    
      // Working with New Content
      if(Titles['NEW CONTENT'] != 'empty'){
        CompleteNewsMessage += `► Новый контент:\n${Titles['NEW CONTENT']}\n\n`
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
        .replace('- Test Track: ','')
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
      if(xxMap.size != 0){
        xxMap.forEach((discount, title) => {
          CompleteNewsMessage += `► ${title}:\n${discount}\n\n` 
        })
      }

      // Working with discounts
      discountMap.forEach((discount, title) => {
        const regex = /\d+/;
        const match = title.match(regex)
        if(match){
          CompleteNewsMessage += `► Скидка ${match[0]}% на:\n${discountMaker(discount, false)}\n`
        }
      })

      if(Titles[`GUN VAN PRIMARY DISCOUNTS`] != 'empty'){
        try{
          let GunDiscountsLines = Titles['GUN VAN PRIMARY DISCOUNTS'].split('\n')
          let discountForGun1 = GunDiscountsLines[0].split(':')[0].trim().replace('OFF','')
          let GunDiscounts1 = GunDiscountsLines[0].split(':')[1].trim()
          let discountForGun2 = GunDiscountsLines[1].split(':')[0].trim().replace('OFF for GTA+ Members','для игроков с подпиской GTA+ ')
          let GunDiscounts2 = GunDiscountsLines[1].split(':')[1].trim()

          CompleteNewsMessage += `► Скидки в оружейном фургоне:\n${discountForGun1}: [${GunDiscounts1}](https://gta.fandom.com/wiki/${GunDiscounts1.replace(' ','_')})\n${discountForGun2}: [${GunDiscounts2}](https://gta.fandom.com/wiki/${GunDiscounts2.replace(' ','_')})\n\n`
        }
        catch(error){
          CompleteNewsMessage += `► Скидки в оружейном фургоне:\n${Titles['GUN VAN PRIMARY DISCOUNTS']}\n\n`
        }
      }

      if(Titles['SALVAGE YARD ROBBERIES'] != 'empty'){
        let salvageYardRobberies = Titles['SALVAGE YARD ROBBERIES'].split('\n')
        if(salvageYardRobberies[salvageYardRobberies.length-1] == ''){ salvageYardRobberies.pop()}
        salvageoutput = []
        salvageYardRobberies.forEach(line => {
          const carInfo = line.split(':')[1].split('(')[0].trim()
          if (carInfo !== undefined) {
            salvageoutput.push(line.replace(`${carInfo}`, `[${carInfo}](https://gta.fandom.com/wiki/${makeALink(carInfo)})`));
          } else {
            console.log('Car info is undefined');
          }
        });

        CompleteNewsMessage += `► Ограбления Утилизационного цеха:\n${salvageoutput.join('\n')}\n\n`
      }

      if (Titles['FIB PRIORITY FILE'] != 'empty') {
        let FIBPriorityFile = Titles['FIB PRIORITY FILE'];
        if (FIBPriorityFile.includes('[')) {
          console.log('yo x2');
          FIBPriorityFile = FIBPriorityFile.split(']')[0].replace('[', '');
        } 
        CompleteNewsMessage += `► Приоритетный файл FIB:\n${FIBPriorityFile}\n\n`;
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
      return CompleteNewsMessage;
  }
  catch(error){
    return error
  }
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
    
function discountMaker(discount, fullTextOrPart){
  let discounts = discount.split('\n')
  let completeDiscounts = ``
  discounts.forEach((line => {
    line = line.replaceAll('- ','')
    completeDiscounts += `─ [${line}](https://gta.fandom.com/wiki/${fullTextOrPart ? line : makeALink(line)})\n`
  }))
  return completeDiscounts
}