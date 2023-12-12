const { SlashCommandBuilder } = require('discord.js');
const { admin, ref } = require('../firebase.js');

module.exports = {
    category: "roblox",
    data: new SlashCommandBuilder()
        .setName('geverifieerden')
        .setDescription('Bekijk wie er allemaal geverifieerd is.'),

    async execute(client, interaction) {
        await interaction.reply("*Even geduld...*")
        try {
            const verifyIDRef = ref.child('VerifyID');
            const snapshot = await verifyIDRef.once('value');
            const verifyIDData = snapshot.val();

            if (!verifyIDData) {
                await interaction.reply('Geen data gevonden in Firebase.');
                return;
            }

            const discordIds = Object.values(verifyIDData).map(user => user.discordid);
            const usernames = [];
            let usercount = 0;

            for (const discordId of discordIds) {
                if (discordId) { 
                    try {
                        const user = await client.users.fetch(discordId);
                        usernames.push(`${user.tag} (${discordId})`);
                        usercount++;
                    } catch (error) {
                        console.error(`Error fetching user with ID ${discordId}:`, error);
                        usernames.push(`Onbekende gebruiker (${discordId})`);
                    }
                }
            }

            const usernamesMessage = usernames.join('\n'); 

            await interaction.channel.send(`Discord gebruikers die geverifieerd zijn(totaal: ${usercount}):\n\`\`\`\n${usernamesMessage}\n\`\`\``);
        } catch (error) {
            console.error('An error occurred:', error);
            interaction.reply('Er is een fout opgetreden.');
        }
    },
};
