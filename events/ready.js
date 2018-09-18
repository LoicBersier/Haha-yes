module.exports = (client) => {
    const { botID, statsChannel } = require('../config.json');
    //  Send stats to the console
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
    //  Send stats to the "stats" channel in the support server if its not the test bot
    if (client.user.id == botID) {
    const channel = client.channels.get(statsChannel);
    channel.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
    }
    client.user.setActivity('"haha help" or "@me help" for help');
}