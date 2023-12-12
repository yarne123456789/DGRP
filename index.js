// hosting: https://cp.divahosting.net/service/e6b68924
// nodemon
const { REST } = require("@discordjs/rest");
const { Client, GatewayIntentBits, Routes, Collection } = require("discord.js");
const botConfig = require("./botConfig.json");
const fs = require("node:fs");
const path = require("node:path");
const noblox = require("noblox.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions] });
client.commands = new Collection();
const slashCommands = [];
require('dotenv').config()


client.once("ready", () => {
  console.log(`${client.user.username} is online`);

  let guildId = botConfig.guildID;
  let clientId = botConfig.clientID;
  let token = process.env.token;

  const rest = new REST({ version: 10 }).setToken(token);

  rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands })
    .then(() => console.log('Succesvol de commands geregistreerd.'))
    .catch(console.error());

});

client.on("ready", () => {
  client.user.setActivity("De Grens Roleplay");// WATCHING, LISTENING ou pas type mais url:lien twitch pour STREAMING  
  client.user.setStatus('idle'); //dnd, invisible, online, idle
});

const commandsPath = path.join(__dirname, 'slashCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const loadCommands = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      // Als het een map is, laad de commando's in die map
      loadCommands(filePath);
    } else if (file.endsWith('.js')) {
      // Als het een JavaScript-bestand is, laad het commando in
      const command = require(filePath);
      client.commands.set(command.data.name, command);
      slashCommands.push(command.data.toJSON());
      console.log(`Het bestand ${command.data.name}.js is geladen`);
    }
  }
};

loadCommands(commandsPath);

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: `Er is een fout opgetreden.`, ephemeral: true });
  }
});


const { admin, ref } = require("./firebase"); // Assuming firebase.js is in the same directory

var getal = 0;
var splrid = 1;

// Read data from Firebase
ref.child("getal").once("value", (snapshot) => {
  const data = snapshot.val();
  if (data !== null) {
    getal = parseInt(data);
  }
});

function updateCount(newCount, message, isCorrect) {
  getal = newCount;
  splrid = message.author.id;

  // Update data in Firebase
  ref.update({ getal: getal }, (err) => {
    if (err) {
      console.error(err);
    } else {
      // Add reaction after Firebase update is complete
      if (isCorrect) {
        message.react('✅');
      } else {
        message.react('❌');
      }
    }
  });
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (splrid == message.author.id) return;
  if (message.channel.id == botConfig.telkanaal) {

    if (message.content.match(/\d+/)) {

      if (message.content.includes("+")) {
        const messageArray = message.content.split("+");
        const firstWord = Number(messageArray[0]);
        const secondarray = Number(messageArray[1]);
        const math = firstWord + secondarray

        if (math == getal + 1) {
          updateCount(getal + 1, message, true);
          return;
        } else {
          message.reply(`${message.author} heeft het verpest bij het getal ${getal}, het huidige getal is nu 0.`);
          updateCount(0, message, false);
          return;
        }

      }



      if (message.content.includes("-")) {
        const messageArray = message.content.split("-");
        const firstWord = Number(messageArray[0]);
        const secondarray = Number(messageArray[1]);
        const math = firstWord - secondarray

        if (math == getal + 1) {
          updateCount(getal + 1, message, true);
          return;
        } else {
          message.reply(`${message.author} heeft het verpest bij het getal ${getal}, het huidige getal is nu 0.`);
          updateCount(0, message, false);
          return;
        }
      }

      if (message.content.includes("*")) {
        const messageArray = message.content.split("*");
        const firstWord = Number(messageArray[0]);
        const secondarray = Number(messageArray[1]);
        const math = firstWord * secondarray

        if (math == getal + 1) {
          updateCount(getal + 1, message, true);
          return;
        } else {
          message.reply(`${message.author} heeft het verpest bij het getal ${getal}, het huidige getal is nu 0.`);
          updateCount(0, message, false);
          return;
        }
      }

      if (message.content.includes("/")) {
        const messageArray = message.content.split("/");
        const firstWord = Number(messageArray[0]);
        const secondarray = Number(messageArray[1]);
        const math = firstWord / secondarray

        if (math == getal + 1) {
          updateCount(getal + 1, message, true);
          return;
        } else {
          message.reply(`${message.author} heeft het verpest bij het getal ${getal}, het huidige getal is nu 0.`);
          updateCount(0, message, false);
          return;
        }
      }

      if (message.content == getal + 1) {
        updateCount(getal + 1, message, true);
        return;
      } else {
        message.reply(`${message.author} heeft het verpest bij het getal ${getal}, het huidige getal is nu 0.`);
        updateCount(0, message, false);
        return;
      }
    }
  }
});



client.login(process.env.token);
