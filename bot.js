const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js")
const fs = require('fs').promises;
const { logCommandExecution } = require('./functions/logger.js');
const { autoNews } = require('./functions/autoNews.js')
const { checkRoleslist } = require('./functions/checkRolesList.js');
const { checkForChampions } = require("./functions/checkForChampions.js");
const { checkForUnregisteredRoles } = require("./functions/checkForUnregisteredRoles.js");
const schedule = require("node-schedule");
const { Console } = require("console");


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
  if(message.content.trim() != '' && message.content.includes('@PingGTAOnline')){
    const consoleChannel = await client.channels.fetch('729263612874588160');
    consoleChannel.send(`<@163547278882111488> News uploaded!  https://discord.com/channels/600695204965646346/795155910153469952/${message.id} ID:\n` + '```' + `${message.id}` + '```')
    autoNews(message.content, client)
  }
  if(message.channel.id == '763822930790056037' && !message.content.startsWith(',suggest') && !message.author.bot){
    message.reply(`Пиши свое предложение по такому шаблону: **\`,suggest идея для ивента\`**, иначе твое предложение не рассмотрят!`)
  }
  if(message.channel.id == '1043620197426270289' && !message.content.startsWith('.suggest') && !message.author.bot){
    message.reply(`Пиши свое предложение по такому шаблону **\`.suggest идея по серверу\`**, иначе твое предложение не рассмотрят!`)
  }
  if(message.content == "j.checkRolesList" && message.author.id == "163547278882111488"){
    checkRoleslist(client);
  }
  if(message.content == "j.checkForChampions" && message.author.id == "163547278882111488"){
    checkForChampions(client, '1128424838692880464');
  }
  if(message.content == "j.checkForUnregisteredRoles" && message.author.id == "163547278882111488"){
    checkForUnregisteredRoles(client)
  }
})

client.on("messageDelete", (messageDelete) => {
  if(messageDelete.channel.id != "729263612874588160"){ return }
  client.users.fetch('163547278882111488', false).then((user) => {
    user.send(`Message by <@${messageDelete.author.id}> was deleted: \`\`\`${messageDelete.content}\`\`\` `);
   });
 });

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

    await checkForChampions(client, interaction.channelId)
  }

  if (interaction.commandName === 'temproleslist'){
    const checkCommand = require(commandsPath + '/temproleslist.js');
    checkCommand.execute(interaction, client, guild);
    logCommandExecution(client, interaction.commandName, interaction.user, 'Successfully');
  }
  
  if (interaction.commandName === 'removerole') {
    const checkCommand = require(commandsPath + '/removerole.js');
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

  if (interaction.commandName === 'addexp') {
    const checkCommand = require(commandsPath + '/addexp.js');
    checkCommand.execute(interaction, client, guild);
  }

  if (interaction.commandName === 'clearcountinglist') {
    const checkCommand = require(commandsPath + '/clearcountinglist.js');
    checkCommand.execute(interaction, client, guild);
  }
})

schedule.scheduleJob('0 0 * * *', function(){
  checkRoleslist(client);
  checkForChampions(client, '1128424838692880464');
  checkForUnregisteredRoles(client)
})

client.login(process.env.TOKEN)