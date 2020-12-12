// Import the discord.js module
const Discord = require("discord.js");
const token = require("./token");
const basicToolbox = require("./basicToolbox");
const kevinToolbox = require("./kevinToolbox");

// Create an instance of a Discord client
const client = new Discord.Client();

// char to trigger bot command
const trigger = "!";

client.once("ready", () => {
  console.log("Einstien Online!");
});

client.on("guildMemberAdd", (member) => {
  kevinToolbox.sendWelcomeMsg(member);
});

client.on("message", (message) => {
  //if the message is not meant for the bot, or the bot itself wrote it, ignore it
  if (!message.content.startsWith(trigger) || message.author.bot) {
    return;
  }

  // Split by spaces to better determine commands
  const words = message.content.split(" ");

  //get actual message without "!"
  const msg = words[0].slice(trigger.length).toLowerCase();

  switch (msg) {
    case "future":
      basicToolbox.futurePong(message);
      break;

    case "introduce":
      basicToolbox.introduce(message);
      break;

    case "addrole":
      kevinToolbox.assignRole(message, words[1]);
      break;

    case "removerole":
      kevinToolbox.removeRole(message, words[1]);
      break;
  }
});

//generate token from outside fucntion to keep token safe
const secret = token.generateToken();

//login to bot
client.login(secret);
