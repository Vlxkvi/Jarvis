const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js")
const fs = require('fs');
const { logCommandExecution } = require('./functions/logger.js');
const { autoNews } = require('./functions/autoNews.js')
const { checkRoleslist } = require('./functions/checkRolesList.js');
const { checkForChampions } = require("./functions/checkForChampions.js");
const { checkForUnregisteredRoles } = require("./functions/checkForUnregisteredRoles.js");
const { autoStartEvents } = require("./functions/autoStartEvents.js");
const { eventRoles } = require("./oftenused.js")
const schedule = require("node-schedule");
const { log } = require("console");
const { start } = require("repl");

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


client.on('messageCreate', async(message) => {
  try{
    const consoleChannel = await client.channels.fetch('729263612874588160');
    if(message.content.trim() != '' && message.content.includes('@PingGTAOnline') && message.channel.id == `795155910153469952`){
      consoleChannel.send(`<@163547278882111488> News uploaded!  https://discord.com/channels/600695204965646346/795155910153469952/${message.id} ID:\n` + '```' + `${message.id}` + '```')
      try{autoNews(message.content, client)}
      catch{consoleChannel.send(`Something went wrong... <:sad:977334495709634560>`)}
    }
    if(message.channel.id == '763822930790056037' && !message.content.startsWith(',suggest') && !message.author.bot){
      message.reply(`Пиши свое предложение по такому шаблону: **\`,suggest идея для ивента\`**, иначе твое предложение не рассмотрят!`)
    }
    if(message.channel.id == '1043620197426270289' && !message.content.startsWith('.suggest') && !message.author.bot){
      message.reply(`Пиши свое предложение по такому шаблону **\`.suggest идея по серверу\`**, иначе твое предложение не рассмотрят!`)
    }
    // create thread in news channel on news message
    if (message.channel.id == '758301980577103882' && message.webhookId) {
        message.startThread({
          name: `Обсуждение`,
          autoArchiveDuration: 60,
          type: 'GUILD_PUBLIC_THREAD'
        }).catch(console.error);
        message.crosspost() 
    }
    if(message.content === "j.checkRolesList" && message.author.id == "163547278882111488"){
      try{ checkRoleslist('1Storage/roleslist.json', client); }
      catch(error){ 
        message.reply(`error: ${error}`) 
        console.log(error)
      }
    }
    if(message.content === "j.checkForChampions" && message.author.id == "163547278882111488"){
      try{ checkForChampions(client, '1128424838692880464'); }
      catch(error){ 
        message.reply(`error: ${error}`) 
        console.log(error)
      }
    }
    if(message.content === "j.checkForUnregisteredRoles" && message.author.id == "163547278882111488"){
      try{ checkForUnregisteredRoles(client) }
      catch(error){ 
        message.reply(`error: ${error}`) 
        console.log(error)
      }
    }
    if(message.content.startsWith(`j.giveEventRoles `) && message.author.id == "163547278882111488"){
      let content = message.content
      let parts = content.split(` `)
      let userid = parts[1]

      if(parts.length != 2){
        message.reply(`Wrong structure of command.\nCorrect structure: \`j.giveEventRoles <userid>\``)
        return;
      }
      let member
      try{
        member = message.guild.members.cache.get(userid);  
      }
      catch(error){
        message.reply(`Error with getting member object:\n${error}`)
        return;
      }

      try{
        await Promise.all(eventRoles.map(roleId => member.roles.add(roleId)));
      }
      catch(error){
        message.reply(`Error with giving roles:\n${error}`)
        return;
      }

      message.reply(`Roles were given to <@${userid}> successfully.`)
    }
    if(message.content === "j.events" && message.author.id == "163547278882111488"){
      try{ await autoStartEvents(client) }
      catch(error){ 
        message.reply(`error: ${error}`) 
        console.log(error)
      }
    }
    if(message.content.startsWith(`j.changemyrole`) && message.author.id == "163547278882111488"){
      try{
        let content = message.content
        let parts = content.split(`--`)
        let newname = parts[1]
        let newcolor = parts[2]? parts[2] : null

        const role = await message.guild.roles.fetch('866628911662891049');
        await role.edit({ name: newname });
        
        if( newcolor ){ 
          await role.edit({ color: newcolor }) 
        }

        message.reply(`Succesfully updated your role!`)
      }
      catch(error){
        message.reply(`error: ${error}`)
      }
    }
  }
  catch(err){
    console.log(err)
  }
})

client.on('interactionCreate', async(interaction) => {
  if (!interaction.isChatInputCommand()) return;

  let guild = client.guilds.cache.get(process.env.guild_id);
  const commandsPath = './commands'
  // map of command names and whether bot needs to log command execution or not
  const commandsMap = new Map([
    ['check', true],
    ['list', true],
    ['upchamp', true],
    ['temprole', true],
    ['temproleslist', true],
    ['remove role', true],
    ['ping', false],
    ['editmessage', false],
    ['news', false],
    ['test', false],
    ['say', false],
    ['addexp', false],
    ['clearcountinglist', false],
    ['eventgtapc', true],
    ['cleanracer', true],
    ['eventban', true]
  ])
  
  if (commandsMap.has(interaction.commandName)){
    //create path to file
    const commandPath = commandsPath + `/${interaction.commandName}.js`
    // if file of this command exists
    if(fs.existsSync(commandPath)){
      const command = require(commandsPath + `/${interaction.commandName}.js`);
      command.execute(interaction, client, guild);
      // if command requires logging
      if(commandsMap.get(interaction.commandName) == true){
        logCommandExecution(client, interaction.commandName, interaction.user)
      }
    }
    // if file doesn't exist
    else{
      interaction.reply(`I recognize this command but don't know how to react, I will notify <@163547278882111488> about this! ( I didn't find the file needed for this command )`)
    }
  }
  // if there is no such command in commandsMap but it is registered on server
  else{
    interaction.reply(`I don't know how to react to this command, I will notify <@163547278882111488> about this!`)
  }
})

schedule.scheduleJob('SendRoleslist.json','0 0 */3 * *', async function(){
  const logChannel = await client.channels.fetch('1270874875309068430');
  logChannel.send({files: ['./1Storage/roleslist.json']})
})

schedule.scheduleJob('Checks','0 0 * * *', async function(){
  const consoleChannel = await client.channels.fetch('729263612874588160');
  
  try{await checkRoleslist('1Storage/roleslist.json', client);}
  catch(error){consoleChannel.send(`<@163547278882111488> Something wrong with CheckRolesList function:\n${error}`)}

  try{await checkForChampions(client, '1128424838692880464');}
  catch(error){consoleChannel.send(`<@163547278882111488> Something wrong with CheckForChampions function:\n${error}`)}

  try{await checkForUnregisteredRoles(client)}
  catch(error){consoleChannel.send(`<@163547278882111488> Something wrong with CheckForUnregistered function:\n${error}`)}

  // Get scheduled discord server events 
  try{await autoStartEvents(client)}
  catch(error){consoleChannel.send(`<@163547278882111488> Something wrong with autoStartEvents function:\n${error}`)}
})

client.login(process.env.TOKEN)