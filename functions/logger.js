const { EmbedBuilder } = require("discord.js");

async function logCommandExecution(client, commandName, user, resultText) {
  const logChannel = await client.channels.fetch('1128424838692880464');

  const commandEmbed = new EmbedBuilder()
    .setColor(0x9caef2)
    .setDescription(`<@${user.id}> used **${commandName}** command. `)
    .setTimestamp()

  await logChannel.send({ embeds: [commandEmbed] });
}

module.exports = {
  logCommandExecution
};
