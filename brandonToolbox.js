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

module.exports = {generateInvite, eliminate};
