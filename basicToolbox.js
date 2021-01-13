const introduction = "Hi guys! I am Salesforce's very own Einstein and I have been assigned to manage this server! Kind of a waste of my talents but whatever :yawning_face: I can't wait to grow along with you guys and make this sever a fun / comfortable place for all!\n\n btw, if you want to check out my source code it is here: ```https://github.com/samaroo/BSBOT```";

const futurePong = (messageObj) => {
    messageObj.channel.send('force!');
};

const introduce = (messageObj) => {
    messageObj.channel.send(introduction);
};

const handleReact = async (reactionObj, user, api, flag=true) => {
    // When we receive a reaction we check if the reaction is partial or not
    if (reactionObj.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reactionObj.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    //if the reactions are coming from Einstein itself
    if(user.id === reactionObj.message.author.id)
        return;
  
    const serverID = reactionObj.message.guild.id;
    const messageID = reactionObj.message.id;
    const response = await api.get(`/${serverID}/reactRoleMessages`);

    for (let message of response.data.reactRoleMessages) {
        if (message.messageID === messageID){
            for (let mapping of message.roleToEmojiMap){
                if(reactionObj.emoji.name === mapping.emoji){
                    const { guild } = reactionObj.message;
                    const roleObj = guild.roles.cache.find((roleInput) => roleInput.name === mapping.role);
                    const member = guild.members.cache.find((memberInput) => memberInput.id === user.id);
                    if(flag){
                        member.roles.add(roleObj);
                        console.log(`assigned role: ${mapping.role}`);
                    }
                    else{
                        member.roles.remove(roleObj);
                        console.log(`removed role: ${mapping.role}`);
                    }
                    break;
                }
            }
            break;
        }
    }
};

const removeFirstWord = (str) => {
    let spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? "" : str.slice(spaceIndex + 1);
};

module.exports = { futurePong, introduce, handleReact, removeFirstWord }