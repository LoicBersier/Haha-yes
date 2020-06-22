const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const { memerToken } = require('../../config.json');

class memerclubCommand extends Command {
	constructor() {
		super('memerclub', {
			aliases: ['memerclub'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Post whatever you like on https://memerclub.gamingti.me ! ( no rules, go wild )',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
        let Attachment = (message.attachments).array();
        let img = '';
        if (!Attachment[0] && !args.text) return message.channel.send('You need to input something for me to post!');
        if (Attachment[0]) {
            img = Attachment[0].url;
        }

        if (args.text)
            if (args.text.includes('discord.gg')) return message.channel.send('No discord invite allowed.');

        fetch(`https://memerclub.gamingti.me/api/post/?token=${memerToken}&text=${encodeURI(args.text)}&image=${img}`)
            .then((response) => {
                return response.json();
            }).then((response) => {
                console.log(response);
                message.channel.send(`Go check your epic post!\nhttps://memerclub.gaminigti.me/post/${response.uuid}`)
            });
    }
}

module.exports = memerclubCommand;