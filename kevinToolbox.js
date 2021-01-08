const Discord = require('discord.js');


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
        .toString()} if you would like to connect with us! Also, go ahead and add your roles using the command **!addrole <role>** where role can be company or position`
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
  if (roleParam == "owner" || roleParam == "mod") {
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

const listMembersWithRole = (message, roleArray) => {
  let roleParam = roleArray.join(" ").toLowerCase();
  const Role = message.guild.roles.cache.find(
    (roleInput) => roleInput.name.toLowerCase() === roleParam
  );

  if (!Role) {
    message.channel.send("Uh oh! Role does not exist.");
    return;
  }

  const Members = message.guild.members.cache
    .filter((member) => member.roles.cache.find((role) => role == Role))
    .map((member) => member.user.tag + "\n");

  const size = Members.length;

  let listEmbed = new Discord.MessageEmbed()
  .setColor("#5dbcd2")
  .setTitle(`${size} Users with the ${Role.name} role:`)
  .setAuthor("Einstein", "https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/get_smart_einstein_feat/e33e22a729df2bb8c97845015ce5bb71_badge.png")
  .setDescription(Members);

  message.channel.send(listEmbed);
};

const doNotInclude = (role) => {
  return  !(role.name == "owner" || role.name == "mod" || role.name == "@everyone" || role.name == "Einstein (PreProd)" || role.name == "Einstein")
};

const listAllRoles = (message) => {
  let roles = message.guild.roles.cache.filter(role => doNotInclude(role)).map(role => role.name + "\n")

  const size = roles.length;

  let rolesEmbed = new Discord.MessageEmbed()
  .setColor("#5dbcd2")
  .setTitle(`${size} roles:`)
  .setAuthor("Einstein", "https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/get_smart_einstein_feat/e33e22a729df2bb8c97845015ce5bb71_badge.png")
  .setDescription(roles);

  message.channel.send(rolesEmbed);
};

module.exports = { sendWelcomeMsg, addRole, removeRole, listMembersWithRole, listAllRoles };
