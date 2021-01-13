// Import the discord.js module
const Discord = require("discord.js");
const axios = require("axios");
//const token = require("./token");
const basicToolbox = require("./basicToolbox");
const kevinToolbox = require("./kevinToolbox");
const brandonToolbox = require("./brandonToolbox");

// Create an instance of a Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const trigger = '!';

//instance of axios to make API calls
const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000
});

client.on('ready', async () => {

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

  //get actual command without "!"
  const command = words[0].slice(trigger.length).toLowerCase();

  console.log(command);

  switch (command) {
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

    case "roles":
      kevinToolbox.listAllRoles(message);
      break;

    case "rolemembers":
      kevinToolbox.listMembersWithRole(message, words.slice(1));
      break;

    case "invite":
      brandonToolbox.generateInvite(message);
      break;

    case "eliminate":
      brandonToolbox.eliminate(message, words.slice(1));
      break;
    
    case "help":
      brandonToolbox.help(message);
      break;
    
    case "register":
      brandonToolbox.registerServer(message);
      break;

    case "reactrole":
      let title;

      //check if command is formatted properly (with title and configJSON)
      if(words.length > 2)
        title = words[1];
      else{
        message.channel.send("Command formatted incorrectly, please try again.");
        return;
      }

      var configJSON;
      //check if config is in proper JSON notation
      try{
        config = basicToolbox.removeFirstWord(message.content);
        configJSON = JSON.parse(basicToolbox.removeFirstWord(config));
      }
      catch(e){
        message.channel.send("Config formatted incorrectly, please use JSON notation.");
        return;
      }

      brandonToolbox.reactRole(message, title, configJSON);
      break;
  }
});

client.on('messageReactionAdd', async (reactionObj, user) => {
	await basicToolbox.handleReact(reactionObj, user, api);
});

client.on('messageReactionRemove', async (reactionObj, user) => {
  await basicToolbox.handleReact(reactionObj, user, api, false);
})

//login to bot
//TOKEN environment variable is set in HEROKU
client.login(process.env.TOKEN);

