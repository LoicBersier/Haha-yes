module.exports = {
    name: 'server',
    description: 'Send some informations about the server',
    guildOnly: true,
    execute(message) {
        message.channel.send(`This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    },
};
