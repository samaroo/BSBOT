const reactRoll = () => {
    
};

const generateInvite = async (messageObj) => {
    let channel = messageObj.channel;
    let invite = await channel.createInvite({unique: true, maxAge: 172800});
    messageObj.channel.send("Pls don't be dumb with this... https://discord.gg/" + invite.code);
};

module.exports = {generateInvite};
