const { SlashCommandBuilder } = require('discord.js');
const { admin, ref } = require('../firebase.js');
const botconf = require('../botConfig.json');

// Define verifyIDRef at the top level
const verifyIDRef = ref.child('VerifyID');

// Function to generate a random alphanumeric string of given length
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports = {
    category: "roblox",
    data: new SlashCommandBuilder()
        .setName('linkroblox')
        .setDescription('Link uw discord account met de bot.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription("Geef uw link-id op.")
                .setRequired(true)),
    async execute(client, interaction) {
        try {
            let idcode = interaction.user.id; // Get the Discord user's ID

            function findUserIdByVerifycode(verifycode) {
                return verifyIDRef.once('value')
                    .then(snapshot => {
                        const verifyIDData = snapshot.val();
                        for (const userId in verifyIDData) {
                            if (verifyIDData[userId].verifycode === verifycode) {
                                return userId;
                            }
                        }
                        return null; // Return null if verifycode is not found
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        throw error;
                    });
            }

            const newVerifycode = generateRandomString(9); // Generate a random 9-character alphanumeric string

            const newData = {
                verified: 'ja', // Replace with the desired value
                discordid: idcode, // Set discordid to the user's Discord ID
                verifycode: newVerifycode, // Set the new verifycode
            };

            const verifycodeToFind = await interaction.options.getString("id");

            findUserIdByVerifycode(verifycodeToFind)
                .then(userId => {
                    if (userId) {
                        return verifyIDRef.child(userId).update(newData);
                    } else {
                        return null;
                    }
                })
                .then(result => {
                    if (result !== null) {
                        interaction.reply(`Succesvol geverifieerd.`);
                    } else {
                        interaction.reply("Kon ID niet vinden.");
                    }
                })
                .catch(error => {
                    console.error('Error updating data:', error);
                    interaction.reply("Er is een fout opgetreden.");
                });
        } catch (error) {
            console.error('An error occurred:', error);
            interaction.reply("Er is een fout opgetreden.");
        }
    },
};
