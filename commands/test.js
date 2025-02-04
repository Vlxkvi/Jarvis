const { EmbedBuilder } = require("discord.js");
const { MessageAttachment } = require('discord.js');
require("dotenv/config");

module.exports = {
  async execute(interaction, client) {
    try {
      const { Client, Intents, MessageAttachment } = require('discord.js');
      const CompleteNewsMessage = '► Транспорт на подиуме казино:\n─ [Nagasaki Outlaw](https://gta.fandom.com/wiki/Outlaw)\n\n► Транспорт в автоклубе:\n─ [Pegassi Toros](https://gta.fandom.com/wiki/Toros)\n\n► Испытание:\n─ Place Top 5 in the LS Car Meet Series three days in a row\n\n► Новый контент:\n─ Assault on Cayo Perico: A new Adversary Mode that pits teams of Attackers and Defenders against each other\n\n► Бонусы:\n─ Unlock the "Ammu-Nation Baseball Tee" by completing a Bunker Sell Mission\n─ Unlock the Atomic Rally Spec livery for the Maibatsu MonstroCiti by completing a Gunrunning Resupply Mission and an Ammu-Nation Contract (within 10 days of completion)\n─ Several classic Adversary Modes will be returning: Occupy, Extraction and Trading Places (Remix)\n\n► Транспорт в Premium Deluxe Motorsport:\n─ [Declasse Walton L35](https://gta.fandom.com/wiki/Walton_L35)\n─ [HVY Insurgent](https://gta.fandom.com/wiki/Insurgent)\n─ [HVY Nightshark](https://gta.fandom.com/wiki/Nightshark)\n─ [Mammoth Squaddie](https://gta.fandom.com/wiki/Squaddie)\n─ [Pegassi Zorrusso](https://gta.fandom.com/wiki/Zorrusso)\n\n► Транспорт в Luxury Autos:\n─ [Ocelot XA-21](https://gta.fandom.com/wiki/XA-21)\n─ [Pegassi Torero](https://gta.fandom.com/wiki/Torero)\n\n► Транспорт для тестовой трассы:\n─ [Annis Euros](https://gta.fandom.com/wiki/Euros)\n─ [Dinka Veto Classic](https://gta.fandom.com/wiki/Veto_Classic)\n─ [Pegassi Reaper](https://gta.fandom.com/wiki/Reaper)\n\n► Тестовая машина HSW:\n─ [Pegassi Weaponized Ignus](https://gta.fandom.com/wiki/Weaponized_Ignus)\n\n► 3X GTA$, RP:\n─ Ammu-Nation Contract Missions\n\n► 2X GTA$, RP:\n─ Assault on Cayo Perico\n─ Bunker Sell Missions\n\n► 2X скорость:\n─ Bunker Research\n\n► Скидка 40% на:\n─ [Mk II Weapon Upgrades](https://gta.fandom.com/wiki/II_Weapon_Upgrades)\n─ [Annis Euros](https://gta.fandom.com/wiki/Euros)\n─ [HVY Insurgent](https://gta.fandom.com/wiki/Insurgent)\n─ [HVY Nightshark](https://gta.fandom.com/wiki/Nightshark)\n─ [Ocelot XA-21](https://gta.fandom.com/wiki/XA-21)\n\n► Скидка 30% на:\n─ [Bunker Properties including upgrades and modifications](https://gta.fandom.com/wiki/Properties_including_upgrades_and_modifications)\n─ [Explosive Weapons: Railgun, Rocket Launcher, Sticky Bombs, Molotovs, Homing Launcher, Remote Bomb, Proximity Mine & Grenade Launcher](https://gta.fandom.com/wiki/Weapons:_Railgun,_Rocket_Launcher,_Sticky_Bombs,_Molotovs,_Homing_Launcher,_Remote_Bomb,_Proximity_Mine_&_Grenade_Launcher)'

      //const attachment = new MessageAttachment(Buffer.from(CompleteNewsMessage), 'file.txt');

      const newsEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(CompleteNewsMessage)
        .setThumbnail('https://c.tenor.com/5c9rqMKtDeEAAAAi/stickergiant-sale.gif')
        .setFooter({
          text: '*нажав на название машины, вы перейдёте на её страницу в интернете',
          iconURL: 'https://c.tenor.com/ulin4ZJ8QcYAAAAi/la-gringa-la-sole.gif'
        });

      interaction.channel.send({ files: ['news.txt']});

    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'An error occurred while removing roles.', ephemeral: true });
    }
  },
};
