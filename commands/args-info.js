module.exports = {
    name: 'args-info',
    description: 'change your text into arguments',
    args: true,
    usage: '<random arguments>',
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }
        message.channel.send(`First argument: ${args[0]}`);
    },
};
