const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { admin, ref } = require('../firebase.js');
const botconf = require('../botConfig.json');

module.exports = {
      category: "moderation",
      data: new SlashCommandBuilder()
            .setName('plantraining')
            .setDescription('Plan een training in.')
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
                        .setRequired(true)
                        .addChoices(
                              { name: 'Try out training', value: 'Try-out training' },
                              { name: 'Rij training', value: 'Rij training' },
                              { name: 'Standaard training', value: 'Standaard training' },
                              { name: 'Schiet training', value: 'Schiet training' },
                        ))

            .addStringOption(option =>
                  option.setName('datum')
                        .setDescription('Kies een datum.')
                        .setRequired(true))

            .addStringOption(option =>
                  option.setName('tijd')
                        .setDescription('Kies een tijdstip.')
                        .setRequired(true))

            .addStringOption(option =>
                  option.setName('host')
                        .setDescription('Kies een host. (niet taggen)')
                        .setRequired(true))

            .addStringOption(option =>
                  option.setName('cohost')
                        .setDescription('Kies een co-host. (niet taggen)')
                        .setRequired(true))

            .addStringOption(option =>
                  option.setName('opmerking')
                        .setDescription('Geef een opmerking.')
                        .setRequired(true))
            .addStringOption(option =>
                  option.setName('status')
                        .setDescription('Kies een status.')
                        .setRequired(true)
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
            let descriptie;
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
            if (welke == "A") {
                  descriptie = "1"
            } else if (welke == "B") {
                  descriptie = "2"
            }
            const embed = new EmbedBuilder()
                  .setTitle("Training")
                  .setDescription(`Training: ${descriptie}`)
                  .setColor(embkleur)
                  .setTimestamp()
                  .addFields(
                        { name: "Eenheid", value: eenheidtekst, inline: true },
                        { name: "Type", value: type, inline: true },
                        { name: "Datum", value: datum, inline: true },
                        { name: "Uur", value: tijd, inline: true },
                        { name: "Host", value: host, inline: true },
                        { name: "Co-Host", value: cohost, inline: true },
                        { name: "Opmerkingen", value: opmerking, inline: true },
                        { name: "Status", value: status, inline: true }
                  )
            const datacohost = `${eenheid}/${welke}/CoHost`;
            const datatype = `${eenheid}/${welke}/Type`;
            const datadatum = `${eenheid}/${welke}/Datum`;
            const datauur = `${eenheid}/${welke}/Uur`;
            const datahost = `${eenheid}/${welke}/Host`;
            const dataopmerking = `${eenheid}/${welke}/Opmerking`;
            const dataeenheid = `${eenheid}/${welke}/Eenheid`;
            const datstatus = `${eenheid}/${welke}/Status`;

            const textChannel = interaction.client.channels.cache.get(botconf.trainingkanaal);
            const sentMessage = await textChannel.send({ embeds: [embed] });

            const messageId = sentMessage.id;
            const databerichtid = `${eenheid}/${welke}/berichtid`;

            const updates = {
                  [datacohost]: cohost,
                  [datadatum]: datum,
                  [dataeenheid]: eenheid,
                  [datahost]: host,
                  [dataopmerking]: opmerking,
                  [datatype]: type,
                  [datauur]: tijd,
                  [databerichtid]: messageId,
                  [datstatus]: status,
            };
            ref.update(updates, (error) => {
                  if (error) {
                        console.error('Fout bij het bijwerken van de gegevens:', error);
                        interaction.reply("Er is een fout opgetreden.");
                  } else {
                        interaction.reply("Training succesvol gepland.");
                  }
            });
      },
};