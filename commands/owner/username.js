const { Command } = require('discord-akairo');

class usernameCommand extends Command {
    constructor() {
        super('username', {
            aliases: ['username'],
            split: 'none',
            category: 'owner',
            ownerOnly: 'true',
            args: [
                {
                    id: 'username',
                    prompt: 'Wich username should i have?',
                    type: 'string'
                }
            ],
            description: {
				content: 'Change the username of the bot',
				usage: '[username]',
				examples: ['haha no']
			}
        });
    }

    async exec(message, args) {
        this.client.user.setUsername(args.username);
        message.channel.send(`The username have been changed sucessfully to ${args.username}`);
    }
}

module.exports = usernameCommand;