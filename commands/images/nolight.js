const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const superagent = require('superagent');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class nolightCommand extends Command {
	constructor() {
		super('nolight', {
			aliases: ['nolight', 'nl'],
			category: 'images',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest',
					default: 'White theme user cant read this :^)'
				}
			],
			description: {
				content: 'Send text in an image that light user can\'t read :^)',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		message.channel.send('Processing <a:loadingmin:527579785212329984>')
			.then(loadingmsg => loadingmsg.delete(2000));

		const canvas = createCanvas(400, 400);
		const ctx = canvas.getContext('2d');
		const { body: buffer } = await superagent.get('https://cdn.discordapp.com/attachments/484013245158522909/551078672132734988/Untitled.png').catch(() => {
			return message.channel.send('An error as occured, please try again');
		});
		const bg = await loadImage(buffer);
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		ctx.font = '70px ubuntu';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText(text, canvas.width / 10, canvas.height / 9);

		fs.writeFile('./img/frame001.png', canvas.toBuffer(), function (err) {
			if (err) {
				return console.error(err);
			}
		});

		async function apng() {
			fs.unlink('./img/nolight.png', (err) => {
				if (err) throw err;
			});
			const { stdout, stderr } = await exec('apngasm -o img/nolight.png img/frame00*.png -s')
				.then(() => message.channel.send({files: ['./img/nolight.png']}));
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
		}
		apng();
		return message.delete();
	}
}

module.exports = nolightCommand;