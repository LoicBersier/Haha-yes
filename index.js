const { AkairoClient } = require('discord-akairo');
const { token, prefix, ownerID } = require('./config.json');

const client = new AkairoClient({
    ownerID: ownerID,
    prefix: prefix,
    emitters: {
        process
    },
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 600000,
    commandDirectory: './commands/',
    inhibitorDirectory: './inhibitors/',
    listenerDirectory: './listeners/'
}, {
    disableEveryone: true
});

//  Ready messages dosent work on the listeners event for some reasons
client.on('ready', async () => {
    //  Send stats to the console
            console.log(`\x1b[32mLogged in as \x1b[34m${client.user.tag}\x1b[0m! (\x1b[33m${client.user.id}\x1b[0m)`);
            console.log(`Ready to serve in \x1b[33m${client.channels.size}\x1b[0m channels on \x1b[33m${client.guilds.size}\x1b[0m servers, for a total of \x1b[33m${client.users.size}\x1b[0m users. \x1b${client.readyAt}\x1b[0m`);
    //  Send stats to the "stats" channel in the support server if its not the test bot
            if (client.user.id == 377563711927484418) {
            const channel = client.channels.get(statsChannel);
            channel.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
            client.user.setActivity(`${prefix} feedback <feedback> to tell me what you think of the bot! | ${prefix} help`);    }
    });

client.login(token);