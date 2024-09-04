const { EmbedBuilder } = require("discord.js");

async function logCommandExecution(client, commandName, user) {
  const logChannel = await client.channels.fetch('1270874434776858756');

  const commandEmbed = new EmbedBuilder()
    .setColor(0x9caef2)
    .setDescription(`<@${user.id}> used **${commandName}** command. `)
    .setTimestamp()

  await logChannel.send({ embeds: [commandEmbed] });
}

module.exports = {
  logCommandExecution
};
