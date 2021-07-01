const Discord = require('discord.js');
const axios = require('axios');

const basicToolBox = require('./basicToolbox');

const api = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 1000
});

const registerServer = async (messageObj) => {
    const serverID = messageObj.guild.id;

    let response = await api.post(`/${serverID}`, {
        token: process.env.TOKEN
    });

    if (response.status === 200)
        messageObj.channel.send("Server successfully registered with Einstein API");
    else
        messageObj.channel.send(`Unsuccessful registration... Status code: ${response.status}`);
};

const registerReactRoleMessage = async (messageObj, roleToEmojiMap) => {
    const serverID = messageObj.guild.id;
    const channelID = messageObj.channel.id;
    const messageID = messageObj.id;

    let response = await api.post(`/${serverID}/reactRoleMessages`, {
        token: process.env.TOKEN,
        channelID,
        messageID,
        roleToEmojiMap
    });

    return response.status
};

const reactRole = async (messageObj, title, configJSON) => {
    //take in options from messageObj ----
    //check if all roles exist ----
    //check if all emojis are real ----
    //create reaction-role message ----
    //give initial reactions
    //call registerReactRoleMessage on new message

    const getEmoji = (emojiName, messageObject) => messageObject.client.emojis.cache.find(
        emojiInput => emojiInput.name === emojiName
    );

    let roleToEmojiMap = [];
    let embedFields = [];

    //check that all roles and emojis are available
    for (let roleStr in configJSON){
        let emojiStr = configJSON[roleStr];
        let role = messageObj.guild.roles.cache.find(
            (roleInput) => roleInput.name === roleStr
        );
        //check to see if each role exists
        if (!role) {
            messageObj.channel.send(`The following role does not exist: ${roleStr}. Please note that capitalization matters.`);
            return;
        }
        //make sure no one is assigning themselves owner or mod
        if (roleStr == "owner" || roleStr == "mod") {
            messageObj.channel.send("Nice try bud. (¬_¬)");
            return;
        }

        let emoji = messageObj.guild.emojis.cache.find(
            (emojiInput) => emojiInput.name === emojiStr
        );
        //check to see if each emoji exists
        let unicodeEmojiFlag = false;
        if (!emoji){
            if(!basicToolBox.isEmoji(emojiStr)){
                messageObj.channel.send(`The following emoji does not exist: ${emojiStr}. Please note that capitalization matters.`);
                return;
            }
            unicodeEmojiFlag = true;
        }

        //for building roleToEmojiMap (different format than configJSON)
        roleToEmojiMap.push({role: roleStr, emoji: emojiStr});

        //building array used to create embed message
        const emojiObj = (unicodeEmojiFlag ? emojiStr : getEmoji(emojiStr, messageObj));
        embedFields.push({name: `${roleStr}  :  ${emojiObj}`, value: `\tTo obtain the \"${roleStr}\" role, react with \"${emojiObj}\"`});
    }

    let embed = new Discord.MessageEmbed()
        .setColor("#5dbcd2")
        .setTitle(title)
        .setAuthor("Einstein", "https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/get_smart_einstein_feat/e33e22a729df2bb8c97845015ce5bb71_badge.png")
        .addFields(embedFields)
    ;

    let embedMsg = await messageObj.channel.send(embed);

    for (let roleStr in configJSON){
        let emojiStr = configJSON[roleStr];
        let emojiObject = getEmoji(emojiStr, messageObj);
        embedMsg.react(emojiObject ? emojiObject : emojiStr);
    }

    const responseStatus = await registerReactRoleMessage(embedMsg, roleToEmojiMap);

    //TODO: move to reactRole function
    if (responseStatus >= 400){
        messageObj.channel.send(`Error registering react-roll message, status code: ${responseStatus}. The above react-role message is now invalid`);
    }
}

const generateInvite = async (messageObj) => {
    let channel = messageObj.channel;
    let invite = await channel.createInvite({
        unique: true,
        maxAge: 86400,
        maxUses: 1
    });
    messageObj.channel.send("Pls don't be dumb with this... https://discord.gg/" + invite.code);
};

const eliminate = async (messageObj) => {
    const author = messageObj.member;
    const authorized = author.roles.cache.find(r => r.name === "mod" || r.name === "owner");
    //guildMember object
    const target = messageObj.mentions.members.first();
    console.log(target);

    if (!authorized) {
        messageObj.channel.send("Nice try bud. (¬_¬)");
        return;
    }

    messageObj.channel.send("Target aquired...");
    messageObj.channel.send("Should I take the shot? (　-_･) ︻デ═一-=");

    const filter = m => m.member == author;

    const collected = await messageObj.channel.awaitMessages(filter, {
        max: 1,
        time: 60000,
        errors: ['time']
    });

    if(collected.values().next().value.content === "yes"){
        target.kick().then((kickedMember) => {
            messageObj.channel.send(`Target eliminated. ${kickedMember.displayName} has been removed from the server`);
        }).catch(() => {
            messageObj.channel.send(`Error executing the elimination. ${kickedMember.displayName} remains in the server`);
        });
    }
    else{
        messageObj.channel.send("Standing down...");
    }
}

const help = (messageObj) => {
    let embed = new Discord.MessageEmbed()
        .setColor("#5dbcd2")
        .setTitle("Command List:")
        .setAuthor("Einstein", "https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/get_smart_einstein_feat/e33e22a729df2bb8c97845015ce5bb71_badge.png")
        .addFields(
            {name: "help", value: "Brings up a help menu with list of commands"},
            {name: "future", value: "I will reply with \"Force!\""},
            {name: "addRole <role>", value: "Adds <role> to caller's role list"},
            {name: "removeRole <role>", value: "Removes <role> from caller's role list"},
            {name: "roles", value: "Lists all the available roles in the server"},
            {name: "rolemembers <role>", value: "Lists all the members with the given role"},
            {name: "invite", value: "Creates a 1 TIME USE invite that lasts 1 day"},
            {name: "eliminate <target>", value: "Kicks <target> from server (ADMIN & MODS ONLY)"},
        )
    ;

    messageObj.channel.send(embed);
}

const introDM = (member) => {

    member.send("Welcome to the FutureForce 2021 Discord server, thank you for joining!");
    member.send("My name is Einstein and I am the bot that manages the discord server! I can do everything you could possibly need from generating invites, to assigning roles!");
    member.send("This is a really laid back server for the interns to just chill and have fun so don't take it seriously at all :)");

    let embed = new Discord.MessageEmbed()
        .setColor("#5dbcd2")
        .setTitle("Getting Started and Set Up")
        .setAuthor("Einstein", "https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/get_smart_einstein_feat/e33e22a729df2bb8c97845015ce5bb71_badge.png")
        .addFields(
            {name: "Roles", value: "The most important thing to set up for this server are your roles. Roles are essentially tags that helps me categorize you guys! You can assign yourself some in the \"roles\" channel!"},
            {name: "Nicknames", value: "A lot of the people in the server have edited their nicknames in the server to display their actual, full name along with pronouns so we can communicate better! You can modify your nickname in the server by clicking your profile picture and selecting \"edit server nickname\""},
            {name: "LinkedIn", value: "I love to see when you guy network with each other so there is a \"linkedIn\" channel in the server where you can drop a link to your profile!"},
            {name: "Instagram", value: "Since this is not super serious, we also promote casual netowrking so we have an \"instagram\" channel for friendly connections!"}
        )
    ;

    member.send(embed);
}

module.exports = {registerServer, reactRole, generateInvite, eliminate, help, introDM};
