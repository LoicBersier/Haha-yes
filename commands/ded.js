module.exports = {
    name: 'ded',
    description: 'Reboot the bot',
    aliases: ['shutdown', 'reboot'],
    execute(message) {
        if (message.author.id === '267065637183029248') {
            process.exit();
        }
    },
};
