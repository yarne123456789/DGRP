const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { admin, ref } = require('../firebase.js');
const { stat } = require('fs');
const botconf = require('../botConfig.json');


module.exports = {
    category: "moderation",
    data: new SlashCommandBuilder()
        .setName('updatetraining')
        .setDescription('Update een training.')
        .addStringOption(option =>
            option.setName('welke')
                .setDescription('Max 2 trainingen per dag per eenheid, als 1 bezet is neem 2.')
                .setRequired(true)
                .addChoices(
                    { name: '1', value: 'A' },
                    { name: '2', value: 'B' },
                ))
        .addStringOption(option =>
            option.setName('eenheid')
                .setDescription('Kies een eenheid.')
                .setRequired(true)
                .addChoices(
                    { name: 'Politie', value: 'Ptraining' },
                    { name: 'Koninklijke Marechaussee', value: 'KMARtraining' },
                    { name: 'Dienst speciale interventies', value: 'DSItraining' },
                    { name: 'Brandweer', value: 'BRWtraining' },
                    { name: 'Ambulance', value: 'AMBUtraining' },


                ))

        .addStringOption(option =>
            option.setName('type')
                .setDescription('Kies een type.')
                .setRequired(false)
                .addChoices(
                    { name: 'Try out training', value: 'Try-out training' },
                    { name: 'Rij training', value: 'Rij training' },
                    { name: 'Standaard training', value: 'Standaard training' },
                    { name: 'Schiet training', value: 'Schiet training' },
                ))

        .addStringOption(option =>
            option.setName('datum')
                .setDescription('Kies een datum.')
                .setRequired(false))

        .addStringOption(option =>
            option.setName('tijd')
                .setDescription('Kies een tijdstip.')
                .setRequired(false))

        .addStringOption(option =>
            option.setName('host')
                .setDescription('Kies een host. (niet taggen)')
                .setRequired(false))

        .addStringOption(option =>
            option.setName('cohost')
                .setDescription('Kies een co-host. (niet taggen)')
                .setRequired(false))

        .addStringOption(option =>
            option.setName('opmerking')
                .setDescription('Geef een opmerking.')
                .setRequired(false))

        .addStringOption(option =>
            option.setName('status')
                .setDescription('Kies een status.')
                .setRequired(false)
                .addChoices(
                    { name: 'Gaat door', value: 'Gaat door' },
                    { name: 'Verzamelen', value: 'Verzamelen' },
                    { name: 'Begonnen', value: 'Begonnen' },
                    { name: 'Gedaan', value: 'Gedaan' },
                )),

    async execute(client, interaction) {
        const requiredRole = interaction.guild.roles.cache.find(r => r.name === botconf.stafrol);

        if (!requiredRole || !interaction.member.roles.cache.has(requiredRole.id)) {
            await interaction.reply('Je hebt niet de vereiste permissies om deze opdracht uit te voeren.');
            return;
        }
        const welke = interaction.options.getString('welke');
        const eenheid = interaction.options.getString('eenheid');
        const type = interaction.options.getString('type');
        const datum = interaction.options.getString('datum');
        const tijd = interaction.options.getString('tijd');
        const host = interaction.options.getString('host');
        const cohost = interaction.options.getString('cohost');
        const opmerking = interaction.options.getString('opmerking');
        const status = interaction.options.getString('status');

        let eenheidtekst;
        let embkleur;
        if (eenheid == "Ptraining") {
            embkleur = "#0062ff";
            eenheidtekst = "Politie"
      } else if (eenheid == "KMARtraining") {
            embkleur = "#0000ff";
            eenheidtekst = "Koninklijke Marechaussee"
      } else if (eenheid == "DSItraining") {
            embkleur = "#000000";
            eenheidtekst = "Dienst Speciale Interventies"
      } else if (eenheid == "BRWtraining") {
            embkleur = "#ff0000";
            eenheidtekst = "Brandweer"
      } else if (eenheid == "AMBUtraining") {
            embkleur = "#ffff00";
            eenheidtekst = "Ambulance"
      } else if (eenheid == "DOtraining") {
            embkleur = "#52524c";
            eenheidtekst = "Douane"
      }
        let updtype;
        let upddatum;
        let upduur;
        let updhost;
        let updcohost;
        let updopmerkingen;
        let updstatus;
        let descriptie;

        let messageId;
        ref.once("value", function (snapshot) {
            var getdata = snapshot.val();
            var gettype = getdata[eenheid][welke].Type;
            var getdatum = getdata[eenheid][welke].Datum;
            var getuur = getdata[eenheid][welke].Uur;
            var gethost = getdata[eenheid][welke].Host;
            var getcohost = getdata[eenheid][welke].CoHost;
            var getopmerkingen = getdata[eenheid][welke].Opmerking;
            var getstatus = getdata[eenheid][welke].Status;
            messageId = getdata[eenheid][welke].berichtid;
            if (!type) {
                updtype = gettype;
            } else {
                updtype = type;
            }
            if (!datum) {
                upddatum = getdatum;
            } else {
                upddatum = datum;
            }
            if (!tijd) {
                upduur = getuur;
            } else {
                upduur = tijd;
            }
            if (!host) {
                updhost = gethost;
            } else {
                updhost = host;
            }
            if (!cohost) {
                updcohost = getcohost;
            } else {
                updcohost = cohost;
            }
            if (!opmerking) {
                updopmerkingen = getopmerkingen;
            } else {
                updopmerkingen = opmerking;
            }
            if (!status) {
                updstatus = getstatus;
            } else {
                updstatus = status;
            }

            if (welke=="A"){
                descriptie="1"
            }else if(welke=="B"){
                descriptie="2"
            }
            const newEmbed = new EmbedBuilder()
                .setTitle("Training")
                .setDescription(`Training: ${descriptie}`)
                .setColor(embkleur)
                .setTimestamp()
                .addFields(
                    { name: "Eenheid", value: eenheidtekst, inline: true },
                    { name: "Type", value: updtype, inline: true },
                    { name: "Datum", value: upddatum, inline: true },
                    { name: "Uur", value: upduur, inline: true },
                    { name: "Host", value: updhost, inline: true },
                    { name: "Co-Host", value: updcohost, inline: true },
                    { name: "Opmerkingen", value: updopmerkingen, inline: true },
                    { name: "Status", value: updstatus, inline: true }
                )



            const datacohost = `${eenheid}/${welke}/CoHost`;
            const datatype = `${eenheid}/${welke}/Type`;
            const datadatum = `${eenheid}/${welke}/Datum`;
            const datauur = `${eenheid}/${welke}/Uur`;
            const datahost = `${eenheid}/${welke}/Host`;
            const dataopmerking = `${eenheid}/${welke}/Opmerking`;
            const dataeenheid = `${eenheid}/${welke}/Eenheid`;
            const databerichtid = `${eenheid}/${welke}/berichtid`;
            const datstatus = `${eenheid}/${welke}/Status`;

            const updates = {
                [datacohost]: updcohost,
                [datadatum]: upddatum,
                [dataeenheid]: eenheid,
                [datahost]: updhost,
                [dataopmerking]: updopmerkingen,
                [datatype]: updtype,
                [datauur]: upduur,
                [databerichtid]: messageId,
                [datstatus]: updstatus,
            };
            ref.update(updates, (error) => {
                if (error) {
                    console.error('Fout bij het bijwerken van de gegevens:', error);
                    interaction.reply("Er is een fout opgetreden.");
                } 
            });
            // Get the text channel where the message is located
            const textChannel = interaction.client.channels.cache.get(botconf.trainingkanaal); // Use the appropriate method to get the channel

            // Fetch the message by its ID
            textChannel.messages.fetch(messageId)
                .then((message) => {
                    // Edit the message with the new embed
                    message.edit({ embeds: [newEmbed] })
                        .then((editedMessage) => {
                            interaction.reply('Training succesvol geupdate.')
                        })
                        .catch((error) => {
                            console.error('Error updating message:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error fetching the message:', error);
                });

        }).catch(function (error) {
            console.log(error);
        });



    },
};

