const { Command } = require('discord.js-commando');
module.exports = class UsernameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'username',
            group: 'owner',
            memberName: 'username',
            description: 'Change the username of the bot',
            ownerOnly: true,
            args: [
                {
                    key: 'username',
                    prompt: 'Wich status should i have?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { username }) {
        this.client.user.setUsername(username);
        message.say(`The username have been changed sucessfully to ${username}`);

    }
};