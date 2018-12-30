const { Command } = require('discord-akairo');

class RebootCommand extends Command {
    constructor() {
        super('reboot', {
            aliases: ['ded', 'reboot', 'restart'],
            split: 'none',
            category: 'owner',
            ownerOnly: 'true',
            description: {
				content: 'Restart the bot',
				usage: '[]',
				examples: ['']
			}
        });
    }

    async exec(message) {
        await message.say('k bye thx\nhttps://i.redd.it/lw8hrvr0l4f11.jpg');
        process.exit();

    }
}

module.exports = RebootCommand;