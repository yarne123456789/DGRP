
const { SlashCommandBuilder } = require('discord.js');
const { admin, ref } = require('../firebase.js');
const botConfig = require("../botConfig.json");

module.exports = {
    category: "information",
    data: new SlashCommandBuilder()
        .setName('deleteverifyid')
        .setDescription('Verwijder iemand uit het verify systeem.!')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Geef een id op.')
                .setRequired(true)),
    async execute(client, interaction) {
        const requiredRole = interaction.guild.roles.cache.find(r => r.name === botConfig.embed_beheer_rol);
        if (!requiredRole || !interaction.member.roles.cache.has(requiredRole.id)) {
            await interaction.reply('Je hebt niet de vereiste permissies om deze opdracht uit te voeren.');
            return;
        }

        try{
            const userId = interaction.options.getString('id');
            console.log("userId", userId);

            const verifyIDRef = ref.child('VerifyID');

            const userRef = verifyIDRef.child('user' + userId);

            const snapshot = await userRef.once('value');

            const userData = snapshot.val();

            if (!userData) {
                await interaction.reply('Geen data gevonden voor de opgegeven gebruiker.');
                return;
            }

            await userRef.remove();

            await interaction.reply('Gebruikersgegevens succesvol verwijderd.');

        }catch(err){
            console.log(err);
        }
       




    },
};

