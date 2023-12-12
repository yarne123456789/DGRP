const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');
const botConfig = require("../botConfig.json");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Geef de warns weer van een gebruiker.')
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

    if(!warns[member.id]){
    var embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setTimestamp()
    .addFields(
        { name: "Aantal waarschuwingen:", value: "Deze persoon heeft geen waarschuwingen." }
    );

    await interaction.reply({embeds: [embed]});    }else{
      var embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTimestamp()
      .addFields(
          { name: "Aantal waarschuwingen:", value: warns[member.id].warns.toString() }
      );
      
      await interaction.reply({embeds: [embed]});
    };
  }
};

