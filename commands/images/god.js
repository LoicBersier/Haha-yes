const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const superagent = require('superagent');


class GodCommand extends Command {
	constructor() {
		super('god', {
			aliases: ['god'],
			category: 'images',
			args: [
				{
					id: 'image',
					type: 'string'
				}
			]
		});
	}

	async exec(message, args) {
		let Attachment = (message.attachments).array();
		let image = args.image;
		if (!Attachment[0] && !image)
			image = message.author.displayAvatarURL;
		else if (Attachment[0] && Attachment[0].url.endsWith('gif'))
			return message.channel.send('Gif dosent work, sorry');
		else if (!image)
			image = Attachment[0].url;

		message.channel.send('Processing <a:loadingmin:527579785212329984>')
			.then(loadingmsg => loadingmsg.delete(1000));

		const canvas = createCanvas(310, 400);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(image);
		ctx.drawImage(background, 20, 80, 275, 250);
		const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/42/1/1539555260-untitled.png').catch(() => {
			return message.channel.send('An error as occured, please try again');
		});
		const bg = await loadImage(buffer);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
	
		const attachment = new Discord.Attachment(canvas.toBuffer(), 'god.png');

		message.delete();
		message.channel.send(attachment)
			.catch(() => {
				message.channel.send('an error as occured. Check the bot/channel permissions');
			});
	}
}

module.exports = GodCommand;