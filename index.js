const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { token } = require('./config.json');


const client = new CommandoClient({
    commandPrefix: 'hehe ',
    owner: '267065637183029248',
    invite: 'https://discord.gg/SsMCsVY',
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'The most used commands'],
        ['admin',   'Commands to make admin life easier'],
        ['owner',   'Commands the owner can use to manage the bot'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
        console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
        client.user.setActivity('with nobody :(');
    });
    
    client.on('error', console.error);

    client.login(token);