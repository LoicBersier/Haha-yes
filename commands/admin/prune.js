const { Command } = require('discord-akairo');

class PruneCommand extends Command {
    constructor() {
        super('Prune', {
            aliases: ['Prune'],
            category: 'admin',
            args: [
                {
                    id: "amount",
                    type: "string"
                }
            ],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            channelRestriction: 'guild',
            description: {
                content: 'Bulk delete messages',
                usage: '[amount]',
                examples: ['50']
            }
        });
    }

    async exec(message,args) {
        if (args.amount > 99) return;
        message.channel.bulkDelete(args.amount + 1, true);
    }
}

module.exports = PruneCommand;