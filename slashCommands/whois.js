const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const noblox = require('noblox.js');

module.exports = {
    category: "roblox",
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Bekijk het profiel van een persoon op roblox.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription("Geef een gebruikersnaam op.")
                .setRequired(true)),

    async execute(client, interaction) {
        const username = interaction.options.getString('username');

        try {
            const id = await noblox.getIdFromUsername(username);
            const info = await noblox.getPlayerInfo(id);
            const avatarurl = await noblox.getPlayerThumbnail([id], '720x720', 'png', false, 'body')
            const embed = new EmbedBuilder()
                .setTitle(`${username} (${id})`)
                .setDescription(info.blurb || 'Geen blurb')
                .addFields({name:'Join datum', value: info.joinDate.toDateString()},
                {name:"Vrienden", value:info.friendCount.toString()},
                {name:"Volgers", value:info.followerCount.toString()},
                {name:"Volgend", value:info.followingCount.toString()}
                )
                .setThumbnail(avatarurl[0].imageUrl)

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.log(error);
        }
    },
};

