const sendWelcomeMsg = (member) => {
  member.guild.channels.cache
    .get("772363553834795032")
    .send(
      `Welcome <@${
        member.user.id
      }>! Please feel free to drop your ${member.guild.channels.cache
        .get("772480723096961034")
        .toString()}, ${member.guild.channels.cache
        .get("772367983342387201")
        .toString()}, and ${member.guild.channels.cache
        .get("774524719458287616")
        .toString()} if you would like to connect with us!`
    );
};

const addRole = (message, roleArray) => {
  let roleParam = roleArray.join(" ").toLowerCase();
  let role = message.guild.roles.cache.find(
    (roleInput) => roleInput.name.toLowerCase() === roleParam
  );
  if (!role) {
    message.channel.send("Uh oh! Role does not exist.");
    return;
  }
  if (roleParam == "owner" || roleParam == "mod"){
    message.channel.send("Nice try bud. (¬_¬)");
    return;
  }
  message.member.roles.add(role);
  message.channel.send("Success! Role added");
};

const removeRole = (message, roleArray) => {
  let roleParam = roleArray.join(" ").toLowerCase();
  let role = message.guild.roles.cache.find(
    (roleInput) => roleInput.name.toLowerCase() === roleParam
  );
  if (!role) {
    message.channel.send("Uh oh! Role does not exist.");
    return;
  }
  message.member.roles.remove(role);
  message.channel.send("Success! Role removed");
};

module.exports = { sendWelcomeMsg, addRole, removeRole };
