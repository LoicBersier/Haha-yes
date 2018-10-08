const { Command } = require('discord.js-commando');
const responseObject = require("../../json/despacito.json");
module.exports = class DespacitoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'despacito',
            group: 'fun',
            memberName: 'despacito',
            description: `despacito`,
            args: [
                {
                    key: 'user',
                    prompt: 'What do you want me to say',
                    type: 'member',
                    default: ''
                }
            ]
        });
    }

    async run(message, { user }) {
        if (!user) {
        const number = Object.keys(responseObject).length;
        const despacitoNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
        if (!user)
            return message.channel.send({files: [responseObject[despacitoNumber]]});
          } else if (user.id === message.author.id) {
           return message.say(`Did you just try to despacitoad yourself?`);
        } else if (user.id === this.client.user.id) {
            return message.say('Nice try but you wont get me :^)');
        } else
        message.delete();
        message.say(`${user}, you have been despacitoad`);
        } 
};