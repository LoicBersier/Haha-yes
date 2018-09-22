const { Command } = require('discord.js-commando');
module.exports = class listEmoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'listemote',
            group: 'fun',
            memberName: 'listemote',
            description: `List the emotes available on the server`,
        });
    }

    async run(message, { text }) {
            const emojiList = message.guild.emojis.map((e, x) => (x + ' = ' + e) + ' | ' +e.name).join('\n');
            message.channel.send(emojiList);
          }
};