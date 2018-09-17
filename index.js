const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { token, prefix } = require('./config.json');
const responseObject = require("./reply.json");
const fs = require("fs");

//  Prefix and ownerID and invite to support server
const client = new CommandoClient({
    commandPrefix: `${prefix}`,
    owner: '267065637183029248',
    invite: 'https://discord.gg/SsMCsVY',
    unknownCommandResponse: false,
    disableEveryone: true,
});
//  Command groups
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun',     'Fun commands'],
        ['utility', 'Some useful commands'],
        ['admin',   'Commands to make admin life easier'],
        ['owner',   'Commands the owner can use to manage the bot'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
//  Ready messages
    client.on('ready', () => {
//  Send stats to the console
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
        console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
//  Send stats to the "stats" channel in the support server if its not the test bot
        if (client.user.id == 377563711927484418) {
        const channel = client.channels.get('487766113292124160');
        channel.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
        }
        client.user.setActivity('"haha help" or "@me help" for help');
});
//  When bot join a guild send embeds with details about it.
    client.on("guildCreate", guild => {
        console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`);
        const channel = client.channels.get('487766113292124160');
        const exampleEmbed = {
            color: 0x008000,
            title: 'Someone added the bot! :D YAY',
            description: `${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`,
            timestamp: new Date(),
        };
        
        channel.send({ embed: exampleEmbed });
    })
//  When bot get kicked from a guild send embeds with details about it.
    client.on("guildDelete", guild => {
        console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}\n***BOT KICKED***`);
        const channel = client.channels.get('487766113292124160');
        const exampleEmbed = {
            color: 0xFF0000,
            title: 'Someone removed the bot :(',
            description: `${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`,
            timestamp: new Date(),
        };
        
        channel.send({ embed: exampleEmbed });
    })

//  Auto respond to messages
//    client.on("message", (message) => {
//        if(responseObject[message.content]) {
//          message.channel.send(responseObject[message.content]);
//        }
//      });

    client.on('error', console.error);

    client.login(token);