const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { admin, ref } = require('../firebase.js');
const noblox = require('noblox.js');

module.exports = {
    category: "information",
    data: new SlashCommandBuilder()
        .setName('profiel')
        .setDescription('Bekijk uw profiel in Vlaanderen Roleplay.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription("Geef een gebruiker op.")
                .setRequired(false)),

    async execute(client, interaction) {
        let gebruiker = interaction.user;

        let Getuser = interaction.options.getMember("user");
        if (Getuser) { gebruiker = Getuser.user };
        let member = await interaction.guild.members.fetch(gebruiker);
        const userMention = interaction.options.getUser("user");
        let discordidToFind;
        if (userMention) {
            discordidToFind = userMention.id;
        } else {
            discordidToFind = interaction.user.id;
        }

        function findRobloxUserIdByDiscordId(discordId) {
            const verifyIDRef = ref.child('VerifyID');

            return verifyIDRef.once('value')
                .then(snapshot => {
                    const verifyIDData = snapshot.val();
                    for (const userId in verifyIDData) {
                        if (verifyIDData[userId].discordid === discordId) {
                            return userId; // Return the Roblox user ID associated with the Discord ID
                        }
                    }
                    return null; // Return null if the Discord ID is not found
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    return null;
                });
        }

        const discordIdToFind = discordidToFind;
        let robloxid;
        let tekstrobloxnaam;

        // ...
        let roltekst = member.roles.highest;

        if (roltekst.id === "941426151618904124") {
            roltekst = "○ Coordinating manager";
        } else if (roltekst.id === "937106188879929404") {
            roltekst = "○ Creator";
        } else {
            roltekst = roltekst.name;
        }


        findRobloxUserIdByDiscordId(discordIdToFind)
            .then(userId => {
                if (userId) {
                    robloxid = userId;
                    const res = robloxid.match(/\d+/)[0];


                    noblox.getUsernameFromId(res)
                        .then(playerInfo => {
                            tekstrobloxnaam = playerInfo;

                            try {
                                var embed = new EmbedBuilder()
                                    .setTitle("Profielinfo")
                                    .setDescription(`Profiel van: ${gebruiker.username}`)
                                    .addFields(
                                        { name: "Rank:", value: roltekst, inline: true },
                                        { name: "Roblox naam", value: tekstrobloxnaam, inline: true }
                                    )
                                    .setColor("#FFFF00")
                                    .setTimestamp()
                                    .setThumbnail(gebruiker.displayAvatarURL({ format: "png", dynamic: true, size: 256 }));

                                interaction.reply({ embeds: [embed] });
                            } catch (err) {
                                console.log(err);
                                interaction.reply("Er is een fout opgetreden.");
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching Roblox data:', error);
                        });
                } else {
                    tekstrobloxnaam = "Er is geen Roblox account gekoppeld aan dit account";


                    var embed = new EmbedBuilder()
                        .setTitle("Profielinfo")
                        .setDescription(`Profiel van: ${gebruiker.username}`)
                        .addFields(
                            { name: "Rank:", value: roltekst, inline: true },
                            { name: "Roblox naam", value: tekstrobloxnaam, inline: true }
                        )
                        .setColor("#FFFF00")
                        .setTimestamp()
                        .setThumbnail(gebruiker.displayAvatarURL({ format: "png", dynamic: true, size: 256 }));

                    interaction.reply({ embeds: [embed] });
                }
            });




    },
};

