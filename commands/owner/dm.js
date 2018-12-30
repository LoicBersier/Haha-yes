const { Command } = require('discord-akairo');

class EvalCommand extends Command {
    constructor() {
        super('dm', {
            aliases: ['dm', 'pm'],
            split: 'none',
            category: 'owner',
            args: [
                {
                    id: 'user',
                    type: 'user'
                },
                {
                    id: 'message',
                    type: 'string'
                }
            ],
            ownerOnly: 'true',
            description: {
				content: 'DM users',
				usage: '[user id] [message]',
				examples: ['267065637183029248 hello i recived your feedback and...']
			}
        });
    }

    async exec(message, args) {
        let user = args.user;
        let message = args.message;

        let Attachment = (message.attachments).array();
        if (Attachment[0]) {
            user.send(`**Message from the dev:**\n${message}\n${Attachment[0].url}`)
            message.channel.send(`DM sent to ${user.username}`)
        }
        else {
            user.send(`**Message from the dev:**\n${message}`)
            message.channel.send(`DM sent to ${user.username}`)
        }

    }
}

module.exports = EvalCommand;