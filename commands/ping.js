const {} = require('discord.js');
module.exports = {
	async execute(interaction, client) {
		try {
			const a = await interaction.deferReply({fetchReply: true});
			await interaction.editReply(`Pong! ${a.createdTimestamp - interaction.createdTimestamp}ms\nWebsocket heartbeat: ${interaction.client.ws.ping}ms`);
		} catch(error) {
			await interaction.followUp({content: error.message, ephemeral: true});
		}
	},
};