// Import the discord.js module
const Discord = require('discord.js');
const generateToken = require('./token');

// Create an instance of a Discord client
const client = new Discord.Client();

client.once('ready', () => {
    console.log('BSBOT Online!');
})

//generate token from outside fucntion to keep token safe
const token = generateToken();

//login to bot
client.login(token);