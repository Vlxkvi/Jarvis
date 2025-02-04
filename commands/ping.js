const {} = require('discord.js');
module.exports = {
	async execute(interaction, client) {
		try {
			const a = await interaction.deferReply({fetchReply: true});
			const latency = a.createdTimestamp - interaction.createdTimestamp;
			const heartbeat = interaction.client.ws.ping;
			const username = interaction.user.username;
			await interaction.editReply(`Pong! ${latency}ms\nWebsocket heartbeat: ${heartbeat}ms\nRequested by: ${username}`);
		} catch(error) {
			await interaction.followUp({content: error.message, ephemeral: true});
		}
	},
};