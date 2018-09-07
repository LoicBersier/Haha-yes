const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { token } = require('./config.json');
const responseObject = require("./reply.json");

//  Prefix and ownerID and invite to support server
const client = new CommandoClient({
    commandPrefix: 'haha ',
    owner: '267065637183029248',
    invite: 'https://discord.gg/SsMCsVY',
});
//  Command groups
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'The most used commands'],
        ['admin',   'Commands to make admin life easier'],
        ['owner',   'Commands the owner can use to manage the bot'],
        ['fun',     'Fun commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
//  Ready messages
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
        console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
        client.user.setActivity('with nobody :(');
            const channel = client.channels.get('487766113292124160');
            channel.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
    });
//  Auto respond to messages
    client.on("message", (message) => {
        if(responseObject[message.content]) {
          message.channel.send(responseObject[message.content]);
        }
      });

    client.on('error', console.error);

    client.login(token);