const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "information",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Geef het help menu weer.'),
    async execute(client, interaction) {

        let files = [];

        client.commands.forEach(command => {
            let constructor = {
                name: command.data.name,
                description: command.data.description,
                category: command.category
            }
            files.push(constructor);
        });

        let response = "\n**Bot commands**\n";
        let generalRes = "\n**__Algemeen__**\n";
        let robloxRes = "\n**__Roblox__**\n";
        let economieRes = "\n**__Economie__**\n";
        let moderationRes = "\n**__Moderatie__**\n";

        for (var i = 0; i < files.length; i++) {
            if (files[i]["category"] === "information") {
                generalRes += `/${files[i]["name"]} - ${files[i]["description"]}\n`;
            } else if (files[i]["category"] === "moderation") {
                moderationRes += `/${files[i]["name"]} - ${files[i]["description"]}\n`;
            } else if (files[i]["category"] === "roblox") {
                robloxRes += `/${files[i]["name"]} - ${files[i]["description"]}\n`;
            }else if (files[i]["category"] === "economie") {
                economieRes += `/${files[i]["name"]} - ${files[i]["description"]}\n`;
            }
        }

        response += generalRes + moderationRes + robloxRes + economieRes;
        await interaction.reply(response);
    },
};