const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const superagent = require('superagent');

class FetishCommand extends Command {
	constructor() {
		super('fetish', {
			aliases: ['fetish'],
			category: 'images',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'image',
					type: 'string',
					optional: true,
				}
			]
		});
	}

	async exec(message, args) {
		let Attachment = (message.attachments).array();
		let image = args.image;
		if (!Attachment[0] && !image)
			image = message.author.displayAvatarURL().replace('webp', 'png');
		else if(Attachment[0] && Attachment[0].url.endsWith('gif'))
			return message.channel.send('Gif dosent work, sorry');
		else if (!image)
			image = Attachment[0].url;
		
		message.channel.send('Processing <a:loadingmin:527579785212329984>')
			.then(loadingmsg => loadingmsg.delete(1000));

		const canvas = createCanvas(528, 559);
		const ctx = canvas.getContext('2d');
		const background = await loadImage('https://image.noelshack.com/fichiers/2018/42/2/1539644291-my-fetish-5910119d988512.png').catch(() => {
			return message.channel.send('An error as occured, please try again');
		});
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		const { body: buffer } = await superagent.get(image);
		const bg = await loadImage(buffer);
		ctx.drawImage(bg, 50, 50, 450, 450);
	

		message.channel.send({files: [canvas.toBuffer()]}).catch(() => {
			message.channel.send('an error as occured. Check the bot/channel permissions');
		});
	}
}

module.exports = FetishCommand;