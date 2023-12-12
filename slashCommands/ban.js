const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const botConfig = require("../botConfig.json");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban een gebruiker.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('user')
        .setDescription("Geef een gebruiker op.")
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reden')
        .setDescription("Geef een reden op.")
        .setRequired(true)),
  async execute(client, interaction) {

    let role = await interaction.guild.roles.cache.find(r => r.name.toLowerCase() == botConfig.stafrol);

    let member = interaction.options.getMember("user");

    if (member.roles.cache.has(role.id)) return interaction.reply("Deze persoon kan je niet bannen.");

    let reason = await interaction.options.getString("reden");

    await member.send(`**Vlaanderen Roleplay**\n je bent verbannen van onze server \n\n **Reden:** ${reason}`).catch(() => {
      interaction.channel.send("Deze persoon heeft zijn privé berichten uitgezet.")
    });

    await member.ban({ days: 0, reason: reason });

    var embed = new EmbedBuilder()
      .setColor("FF0000")
      .setDescription(`**Member:** ${member.user.tag} (${member.user.id})\n**Actie:** Ban\n**Reden:** ${reason}`)
      .setTimestamp();

    interaction.reply(`${member.user.tag} is verbannen.`)

    await interaction.guild.channels.cache.find(c => c.name.toLowerCase() == '📚┊mod-logs').send({ embeds: [embed] })

  },
};

