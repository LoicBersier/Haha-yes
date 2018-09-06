module.exports = {
    name: 'user-info',
    description: 'Send some information about the user',
    execute(message) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    },
};
