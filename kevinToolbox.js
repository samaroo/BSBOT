// constants for each role id
const SALESFORCE_ROLE = '787184532183973928';
const TABLEAU_ROLE = '787184912641294368';
const MULESOFT_ROLE = '787185395116539915';
const SWE_ROLE = '772891867594883116';
const PM_ROLE = '772891923614531584';
const ALUM_ROLE = '773029176504221696';
const PD_ROLE = '774064903673085952';
const PSE_ROLE = '777718170663518210';
const TMP_COM_ROLE = '778886992221569026';

const sendWelcomeMsg = (member) => {
    member.guild.channels.cache.get('772363553834795032').send(`Welcome <@${member.user.id}>! Please feel free to drop your ${member.guild.channels.cache.get('772480723096961034').toString()}, ${member.guild.channels.cache.get('772367983342387201').toString()}, and ${member.guild.channels.cache.get('774524719458287616').toString()} if you would like to connect with us!`);
}

const assignRole = (message, role) => {
    switch(role){
        case "salesforce":
            message.member.roles.add(SALESFORCE_ROLE)
            .then(message.channel.send("Success! Role Added"))
            .catch(err => message.channel.send("Uh Oh! An error occured"))
            break;
    }
}


const removeRole = (message, role) => {
    switch(role){
        case "salesforce":
            message.member.roles.remove(SALESFORCE_ROLE)
            .then(message.channel.send("Success! Role Removed"))
            .catch(err => message.channel.send("Uh Oh! An error occured"))
            break;
    }
}

module.exports = {sendWelcomeMsg, assignRole, removeRole}