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

const removeEmojis = (str) => {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return str.replace(regex, "");
};
  
const isOnlyEmoji = (str) => {
    return !removeEmojis(str).length;
};

const isEmoji = (str) => {
    var ranges = [
        '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
    ];
    const check = str.match(ranges.join('|'));
    return (check ? check.length === 1 : false);
}

module.exports = { futurePong, introduce, handleReact, removeFirstWord, isEmoji}