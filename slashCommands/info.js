const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "information",
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Geeft info.'),
	async execute(client, interaction) {
		var serverIcon = interaction.guild.iconURL();

        let date = new Date(interaction.member.joinedTimestamp);
        
        var botEmbed = new EmbedBuilder()
            .setTitle("*Vlaanderen Roleplay*")
            .setDescription("Info over Vlaanderen Roleplay")
            .setColor("#fff200")
            .addFields(
                { name: "Bot naam", value: client.user.username},
                { name: "Je bent de server gejoined op", value: date.toLocaleDateString()},
                { name: "Aantal leden", value: interaction.guild.memberCount.toString()}

            )
            .setThumbnail(serverIcon)
            .setTimestamp()
            .setAuthor( { name: `@${interaction.member.user.username}`});
        
        await interaction.reply({embeds: [botEmbed]});
	},
};

