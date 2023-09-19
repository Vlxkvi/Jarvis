const { Client, GatewayIntentBits, EmbedBuilder, MessageEmbed, WebhookClient } = require("discord.js")
const fs = require('fs').promises;
const { logCommandExecution } = require('./functions/logger.js');
const { autoNews } = require('./functions/autoNews.js')


require("dotenv/config")

const prefix = "j.";

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
})
client.on('ready as hell', () => {
    console.log('The bot is ready.')
})

client.on('messageCreate', message => {
    if (message.channel.id == '983658070385250364') {
      checkRolesList();
    };  
    if(message.channel.id == '1103310828104597534' && message.content.trim() != '' && message.content.startsWith('Hey')){
      const consoleChannel = client.channels.fetch('729263612874588160');
      //consoleChannel.send('Есть контакт')
      autoNews(message.content, client)
    }
})

client.on('interactionCreate', async(interaction) => {
    if (!interaction.isChatInputCommand()) return;

    let guild = client.guilds.cache.get(process.env.guild_id);
    const commandsPath = './commands'
    
    if (interaction.commandName === 'ping') {
      const checkCommand = require(commandsPath + '/ping.js');
      checkCommand.execute(interaction, client, guild);
    }
    
    if (interaction.commandName === 'check') {
      const checkCommand = require(commandsPath + '/check.js');
      checkCommand.execute(interaction, client, guild);
      logCommandExecution(client, interaction.commandName, interaction.user, 'Succesfully')
    }
    
    if (interaction.commandName === 'list') {
      const checkCommand = require(commandsPath + '/list.js');
      checkCommand.execute(interaction, client)
      logCommandExecution(client, interaction.commandName, interaction.user, 'Successfully');
    }
    
    if (interaction.commandName === 'up-champ') {
      const checkCommand = require(commandsPath + '/up-champ.js');
      checkCommand.execute(interaction, client, guild);
      logCommandExecution(client, interaction.commandName, interaction.user, 'Successfully');
    }

    if (interaction.commandName === 'temprole'){
      const checkCommand = require(commandsPath + '/temprole.js');
      checkCommand.execute(interaction, client, guild);
      logCommandExecution(client, interaction.commandName, interaction.user, 'Successfully');
    }

    if (interaction.commandName === 'temproleslist'){
      const checkCommand = require(commandsPath + '/temproleslist.js');
      checkCommand.execute(interaction, client, guild);
      logCommandExecution(client, interaction.commandName, interaction.user, 'Successfully');
    }
    
    if (interaction.commandName === 'event') {
      const checkCommand = require(commandsPath + '/event.js');
      checkCommand.execute(interaction, client, guild);
      logCommandExecution(client, interaction.commandName, interaction.user, 'Successfully');
    }
    
    if (interaction.commandName === 'eventlist') {
      const checkCommand = require(commandsPath + '/eventlist.js');
      checkCommand.execute(interaction, client, guild);
      logCommandExecution(client, interaction.commandName, interaction.user, 'Successfully');
    }
    
    if (interaction.commandName === 'editmessage') {
      const checkCommand = require(commandsPath + '/editmessage.js');
      checkCommand.execute(interaction, client)
    }

    if (interaction.commandName === 'news') {
      const checkCommand = require(commandsPath + '/news.js');
      checkCommand.execute(interaction, client)
    }

    if (interaction.commandName === 'test') {
      const checkCommand = require(commandsPath + '/test.js');
      checkCommand.execute(interaction, client)
    }

    if (interaction.commandName === 'say') {
      const checkCommand = require(commandsPath + '/say.js');
      checkCommand.execute(interaction, client, guild);
    }
    
})


async function checkRolesList() {
  try {
    const currentTime = Math.floor(Date.now() / 1000)

    // Read roleslist.json
    const data = await fs.readFile('roleslist.json', 'utf8');
    const rolesList = JSON.parse(data);

    rolesList.forEach(async (entry) => {
      const key = Object.keys(entry)[0]; 
      const entryTime = parseInt(key); 
      const timeDifference = currentTime - entryTime;

      // Time to keep role - 3 days
      const keepingTime = 720*60*60; 

      if (timeDifference > keepingTime) {
        console.log(`Вийшов ${key} зараз ${currentTime}, пройшло ${currentTime - entryTime}`);
        // Removing roles 
        const { user1, user2, user3, user4, user5, role } = entry[key];
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        let userRemovedRoles = [];

        if (user1) {
          const member = guild.members.cache.get(user1);
          if (member) await member.roles.remove(role);
          userRemovedRoles.push( `<@${member.id}>` )
        }
        if (user2) {
          const member = guild.members.cache.get(user2);
          if (member) await member.roles.remove(role);
          userRemovedRoles.push( `<@${member.id}>` )
        }
        if (user3) {
          const member = guild.members.cache.get(user3);
          if (member) await member.roles.remove(role);
          userRemovedRoles.push( `<@${member.id}>` );
        }
        if (user4) {
          const member = guild.members.cache.get(user4);
          if (member) await member.roles.remove(role);
          userRemovedRoles.push( `<@${member.id}>` );
        }
        if (user5) {
          const member = guild.members.cache.get(user5);
          if (member) await member.roles.remove(role);
          userRemovedRoles.push( `<@${member.id}>` );
        }
        output = `Role <@&${role}> was removed from: `
        output += userRemovedRoles.join(', ');

        const logChannel = await client.channels.fetch('1128424838692880464');

         const RemovingEmbed = new EmbedBuilder()
          .setColor(0xdc143c)
          .setDescription(output)
          .setTimestamp()

        await logChannel.send({ embeds: [RemovingEmbed] });

        // Deleting record from roleslist.json
        rolesList.splice(rolesList.indexOf(entry), 1);

        // Rewriting roleslist.json
        try {
          const jsonData = JSON.stringify(rolesList, null, 2);
          await fs.writeFile('roleslist.json', jsonData);
        } catch (err) {
          console.error('Error writing to roleslist.json:', err);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

client.login(process.env.TOKEN)