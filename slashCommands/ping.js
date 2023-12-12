const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: "information",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Antwoord met pong!'),
	async execute(client, interaction) {
		await interaction.reply('Pong!');
	},
};

