const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const superagent = require('superagent');

class paintCommand extends Command {
	constructor() {
		super('paint', {
			aliases: ['paint'],
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

		const canvas = createCanvas(488, 400);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(image).catch(() => {
			return message.channel.send('An error as occured, please try again');
		});
		ctx.drawImage(background, 65, 30, 405, 280);
		const { body: buffer } = await superagent.get('https://cdn.discordapp.com/attachments/488483518742134794/542633779601342476/260293545019212.png');
		const bg = await loadImage(buffer);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

		message.channel.send({files: [canvas.toBuffer()]}).catch(() => {
			message.channel.send('an error as occured. Check the bot/channel permissions');
		});
	}
}

module.exports = paintCommand;