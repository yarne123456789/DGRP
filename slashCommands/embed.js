const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const botConfig = require("../botConfig.json");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Stuur een embed bericht.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Kanaal voor het embed.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Titel voor het embed.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Beschrijving voor het embed.(gebruik omegekeerde slash+n voor een nieuwe regel)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('kleur')
        .setDescription('Voeg een kleur toe (HEX code)')
        .setRequired(false)),
  async execute(client, interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const selectedColor = interaction.options.getString('kleur');
    const formateerdebeschrijving = description.replace(/\\n/g, '\n');
    const requiredRole = interaction.guild.roles.cache.find(r => r.name === botConfig.embed_beheer_rol);
    if (!requiredRole || !interaction.member.roles.cache.has(requiredRole.id)) {
      await interaction.reply('Je hebt niet de vereiste permissies om deze opdracht uit te voeren.');
      return;
    }

    let kleur = "FFFF00"
    if (selectedColor) {
      kleur = selectedColor;
    } else {
      kleur = "#FFFF00";
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(formateerdebeschrijving)
      .setColor(kleur)
      .setTimestamp()

    channel.send({ embeds: [embed] });

    await interaction.reply('Embed bericht succesvol verstuurd.');
  },
};

