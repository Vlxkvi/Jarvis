const schedule = require("node-schedule");

async function autoStartEvents(client){
    const guildScheduledEvents = client.guilds.cache.get(process.env.GUILD_ID).scheduledEvents;
    const upcomingEvents = await guildScheduledEvents.fetch();
    const logChannel = await client.channels.fetch('1270875189902573620');
    
    for (const event of upcomingEvents.values()) {
      const eventID = event.id
      const startTime = event.scheduledStartTimestamp;

      const date = new Date(startTime)
      const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()+1} ${date.getDay()}`
      const jobs = schedule.scheduledJobs;
  
      if (!jobs.hasOwnProperty(cronTime)) { 
        logChannel.send(`Creating scheduled job for event with id \`${eventID}\` with cron time of \`${cronTime}\`.`)
        schedule.scheduleJob(eventID, cronTime, async function() {
          try {
            const eventToStart = await guildScheduledEvents.fetch(eventID);
            await eventToStart.edit({ status: 2 });
            const logChannel = await client.channels.fetch('1270875189902573620');
            logChannel.send(`Started an event.`)
          } catch (error) {
            console.error('Failed to start event:', error);
          }
        });
      }
    }
}

module.exports = {
  autoStartEvents
};