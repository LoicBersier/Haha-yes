const { Command } = require('discord-akairo');

class BotAvatarCommand extends Command {
	constructor() {
		super('botavatar', {
			aliases: ['botavatar', 'bavatar'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'image',
					type:'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Change bot profil picture',
				usage: '[image attachment/or link]',
				examples: ['image file']
			}
		});
	}

	async exec(message, args) {
		let Attachment = (message.attachments).array();
		let image = args.image;
		if (!Attachment[0] && !image)
			return message.say('You didint provide any images');
		else if (image && !Attachment[0]) {
			this.client.user.setAvatar(image)
				.catch(() => message.channel.send('The link you provided dosen\'t work... is it a picture?'));
			return message.channel.send('The avatar have been changed succesfully');
		}
		else 
			image = Attachment[0].url;
			
		this.client.user.setAvatar(image)
			.catch(() => message.channel.send('The link you provided dosen\'t work... is it a picture?'));
		message.channel.send('The avatar have been changed succesfully');


	}
}

module.exports = BotAvatarCommand;