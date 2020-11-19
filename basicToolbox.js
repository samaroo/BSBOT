const introduction = "Hi guys! I am Salesforce's very own Einstein and I have been assigned to manage this server! Kind of a waste of my talents but whatever :yawning_face: I can't wait to grow along with you guys and make this sever a fun / comfortable place for all!\n\n btw, if you want to check out my source code it is here: ```https://github.com/samaroo/BSBOT```";

const futurePong = (messageObj) => {
    messageObj.channel.send('force!');
}

const introduce = (messageObj) => {
    messageObj.channel.send(introduction);
}

module.exports = { futurePong, introduce }