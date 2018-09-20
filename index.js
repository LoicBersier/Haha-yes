const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { token, prefix, botID, statsChannel, ownerID, supportServer } = require('./config.json');
const responseObject = require("./json/reply.json");
const delresponseObject = require("./json/delreply.json");
const reactObject = require("./json/react.json");

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
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
//  Ready messages
    client.on('ready', async () => {
//  Send stats to the console
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
        console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
//  Send stats to the "stats" channel in the support server if its not the test bot
        if (client.user.id == botID) {
        const channel = client.channels.get(statsChannel);
        channel.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
        }
        client.user.setActivity('"haha help" or "@me help" for help');
});
//  When bot join a guild send embeds with details about it.
    client.on("guildCreate", async guild => {
        console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`);
        const channel = client.channels.get(statsChannel);
        const addEmbed = {
            color: 0x008000,
            title: 'Someone added the bot! :D YAY',
            description: `${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`,
            timestamp: new Date(),
        };
        
        channel.send({ embed: addEmbed });
    })
//  When bot get kicked from a guild send embeds with details about it.
    client.on("guildDelete", async guild => {
        console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}\n***BOT KICKED***`);
        const channel = client.channels.get(statsChannel);
        const kickEmbed = {
            color: 0xFF0000,
            title: 'Someone removed the bot :(',
            description: `${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`,
            timestamp: new Date(),
        };
        
        channel.send({ embed: kickEmbed });
    })

    client.on("message", async (message) => {
        let message_content = message.content.toLowerCase();

//  Delete the messages that triggered it and send a messages
//      if(delresponseObject[message_content]) {
//          message.delete();
//          message.say(delresponseObject[message_content]);
//        } else 
//  React to the message and send an auto response with it
        if(responseObject[message_content] && reactObject[message_content]) {
            message.say(responseObject[message_content]);
            message.react(reactObject[message_content]);
//  React only to the messages
        } 
        else if(reactObject[message_content]) {
            message.react(reactObject[message_content]);
        }
//  auto respond to messages
        else if(responseObject[message_content]) {
          message.say(responseObject[message_content]);
        } 
    });

    client.on('error', console.error);
    process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

    client.login(token);