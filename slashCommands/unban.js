const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban een gebruiker.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName('id')
                .setDescription("Geef een id op.")
                .setRequired(true)),
    async execute(client, interaction) {

        let id = await interaction.options.getString("id");

        let member;
        
        let bans = await interaction.guild.bans.fetch();

        if(bans.has(id)) member = bans.get(id);
        else return interaction.reply('Deze gebruiker is niet verbannen.');

        await interaction.guild.members.unban(id);

        var embed = new EmbedBuilder()
            .setColor("00FF00")
            .setDescription(`**Member:** ${member.user.tag} (${member.user.id})\n**Actie:** Unban`)
            .setTimestamp();

        interaction.reply(`${member.user.tag} is niet meer verbannen.`)

        await interaction.guild.channels.cache.find(c => c.name.toLowerCase() == '📚┊mod-logs').send({ embeds: [embed] })

    },
};

