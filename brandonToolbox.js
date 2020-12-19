const reactRoll = () => {
    
};

const generateInvite = async (messageObj) => {
    let channel = messageObj.channel;
    let invite = await channel.createInvite({
        unique: true,
        maxAge: 86400,
        maxUses: 1
    });
    messageObj.channel.send("Pls don't be dumb with this... https://discord.gg/" + invite.code);
};

module.exports = {generateInvite};
