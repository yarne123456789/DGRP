const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');
const botConfig = require("../botConfig.json");

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn een gebruiker!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription("Geef een gebruiker op. (link van een foto/video plaatsen als bewijs)")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reden')
                .setDescription("Geef een reden op.")
                .setRequired(true)),
    async execute(client, interaction) {
        const requiredRole = interaction.guild.roles.cache.find(r => r.name === botConfig.stafrol);

        if (!requiredRole || !interaction.member.roles.cache.has(requiredRole.id)) {
            await interaction.reply('Je hebt niet de vereiste permissies om deze opdracht uit te voeren.');
            return;
        }
      
        let role = await interaction.guild.roles.cache.find(r => r.name.toLowerCase() == "○ Team Vlaanderen");

        let member = interaction.options.getMember("user");

        let reason = await interaction.options.getString("reden");

        const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
        
        if (!warns[member.id]) warns[member.id] = {
            warns: 0
        };

        warns[member.id].warns++;

        var embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTimestamp()
            .setDescription(`**Gewarnd:** ${member.user.tag} (${member.user.id})
                 **Reden: ** ${reason}
                 **Gewarnd door:** ${interaction.user.tag}`)
            .addFields(
                { name: "Aantal warns", value: warns[member.id].warns.toString() }
            );

        await interaction.guild.channels.cache.find(c => c.name.toLowerCase() == '🚫┊discord-warnpunten-bans').send({ embeds: [embed] })

        await interaction.reply(`${member.user.tag} is gewaarschuwd.`)

        fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
            if (err) console.log(err);
        });
    },
};

