const { Command } = require('discord.js-commando');
module.exports = class DespacitoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'despacito',
            group: 'fun',
            memberName: 'despacito',
            description: `despacito`,
        });
    }

    async run(message) {
        message.say("DES\nPA\nCITO");
        message.channel.send({files: ["https://images-eu.ssl-images-amazon.com/images/I/619fzjO1rmL._SS500.jpg"]}); 
        message.channel.send({files: ["https://cdn.dopl3r.com/memes_files/despacito-eS6Lm.jpg"]}); 
        message.say("https://www.youtube.com/watch?v=kJQP7kiw5Fk");
          }
};