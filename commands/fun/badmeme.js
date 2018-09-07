const { Command } = require('discord.js-commando');
module.exports = class BadmemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'badmeme',
            group: 'fun',
            memberName: 'badmeme',
            description: 'test.',
        });
    }

    run(message) {
        const number = 3;
        const imageNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
        message.say( {files: ["./pictures/" + imageNumber + ".jpeg"]});
    }
};