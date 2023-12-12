const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const botConfig = require("../botConfig.json");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName('delwarn')
    .setDescription('Verwijder een warm van een gebruiker!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription("Geef een gebruiker op.")
        .setRequired(true)),
  async execute(client, interaction) {
    const requiredRole = interaction.guild.roles.cache.find(r => r.name === botConfig.stafrol);

    if (!requiredRole || !interaction.member.roles.cache.has(requiredRole.id)) {
      await interaction.reply('Je hebt niet de vereiste permissies om deze opdracht uit te voeren.');
      return;
    }
    let role = await interaction.guild.roles.cache.find(r => r.name.toLowerCase() == botConfig.stafrol);

    let member = interaction.options.getMember("user");


    const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
    if (!warns[member.id]) {
      await interaction.reply("Deze gebruiker heeft geen waarschuwingen.")
    } else {
      if (!warns[member.id].warns == 0) {



        warns[member.id].warns--;

        var embed = new EmbedBuilder()
          .setColor("#57F287")
          .setTimestamp()
          .setDescription(`**Warn verwijderd van:** ${member.user.tag} (${member.user.id})
                     **Geunwarnd door:** ${interaction.user.tag}`)
          .addFields(
            { name: "Aantal warns", value: warns[member.id].warns.toString() }
          );

        await interaction.guild.channels.cache.find(c => c.name.toLowerCase() == '🚫┊discord-warnpunten-bans').send({ embeds: [embed] })

        await interaction.reply(`${member.user.tag} heeft een warn minder.`)

        fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
          if (err) console.log(err);
        });
      } else {
        await interaction.reply(`${member.user.tag} heeft geen warns.`);
      };
    };
  },
};

