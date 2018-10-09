const { CommandoClient } = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path'); 
const { token, prefix, statsChannel, ownerID, supportServer } = require('./config.json');
const responseObject = require("./json/reply.json");
const reactObject = require("./json/react.json");
const imgResponseObject = require("./json/imgreply.json");

//  Prefix and ownerID and invite to support server
const client = new CommandoClient({
    commandPrefix: prefix,
    owner: ownerID,
    invite: supportServer,
    unknownCommandResponse: false,
    disableEveryone: true,
});
//  Command groups
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun',     'Fun'],
        ['utility', 'Utility'],
        ['admin',   'Admins'],
        ['owner',   'Owner'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        help: false,
        ping: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));
//  Ready messages
    client.on('ready', async () => {
//  Send stats to the console
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
        console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
//  Send stats to the "stats" channel in the support server if its not the test bot
        if (client.user.id == 377563711927484418) {
        const channel = client.channels.get(statsChannel);
        channel.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
        client.user.setActivity('haha feedback <feedback> to tell me what you think of the bot! | haha help');    }
});

//  When bot join a guild send embeds with details about it.
    client.on("guildCreate", async guild => {
        console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}`);
        const channel = client.channels.get(statsChannel);
        const addEmbed = new Discord.RichEmbed()
        .setColor("#52e80d")
        .setTitle('Someone added me ! YAY :D')
        .setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
        .setThumbnail(guild.iconURL)
        .setDescription(`${guild.name}\n${guild.id}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\n(${guild.owner})`)
        .setTimestamp()
        
        channel.send({ embed: addEmbed });
    });

//  When bot get kicked from a guild send embeds with details about it.
    client.on("guildDelete", async guild => {
        console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}\n***BOT KICKED***`);
        const channel = client.channels.get(statsChannel);

        const kickEmbed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setTitle('They kicked me out :(')
        .setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
        .setThumbnail(guild.iconURL)
        .setDescription(`${guild.name}\n${guild.id}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\n(${guild.owner})`)
        .setTimestamp()

        console.log('***BOT KICKED***')
        channel.send({ embed: kickEmbed });
    });

    client.on("message", async (message) => {
        let message_content = message.content.toLowerCase();
//  React to the message and send an auto response with it
        if (message.author.bot) return; {
//  Reply with images as attachement
        if(imgResponseObject[message_content]) {
            message.channel.send({files: [imgResponseObject[message_content]]}); 
        } 
//  React only to the messages
        else if(reactObject[message_content]) {
            message.react(reactObject[message_content]);
        }
//  auto respond to messages
        else if(responseObject[message_content]) {
            message.channel.send(responseObject[message_content]);
        } else if (message_content.includes("like if")) {
            message.react("\u{1F44D}")
        } else if (message_content.includes("jeff")) {
            message.react("496028845967802378")
        }
    }});

    client.on('error', console.error);
    process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

    client.login(token);