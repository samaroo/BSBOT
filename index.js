// Import the discord.js module
const Discord = require("discord.js");
const token = require("./token");
const basicToolbox = require("./basicToolbox");
const kevinToolbox = require("./kevinToolbox");

// Create an instance of a Discord client
const client = new Discord.Client();

// char to trigger bot command
const trigger = "!";

// This code is used for hosting, to keep the bot running 24/7
var http = require('http');  

http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080);

client.on('ready', () => {

  console.log('Your Bot is now Online.')
  let activities = [`chill gang`, `with the gang`, `with the gang`   ],i = 0;

  setInterval(() => client.user.setActivity(`${activities[i++ %  activities.length]}`,  {type:"STREAMING",url:"https://www.youtube.com/watch?v=DWcJFNfaw9c"  }), 5000)

})

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
      kevinToolbox.addRole(message, words.slice(1));
      break;

    case "removerole":
      kevinToolbox.removeRole(message, words.slice(1));
      break;
  }
});

//generate token from outside fucntion to keep token safe
const secret = token.generateToken();

//login to bot
client.login(secret);

