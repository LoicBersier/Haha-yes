const { Command } = require('discord-akairo');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { Buffer } = require('buffer');
const attachment = require('../../utils/attachment');
const downloader = require('../../utils/download');

class cursesCommand extends Command {
	constructor() {
		super('curses', {
			aliases: ['curses'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
				},
				{
					id: 'webm',
					match: 'flag',
					flag: ['--webm']
				},
			],
			description: {
				content: 'Mess with video length. webm = expanding length and mp4 = very long length',
				usage: '[link or attachment]',
				examples: ['https://www.youtube.com/watch?v=QLCPgZ51poU']
			}
		});
	}

	async exec(message, args) {
		let replaceAt = function(string, index, replacement) {
			return string.substr(0, index) + replacement + string.substr(index + replacement.length);
		};

		let link;
		if (args.link)
			link = args.link.href;
		else
			link = await attachment(message);

		let ext = path.extname(link.toLowerCase());
		if (ext !== '.webm' || ext !== '.mp4')
			ext = '.mp4';


		if (args.webm) ext = '.webm';

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');
		downloader(link, null, `${os.tmpdir()}/${message.id}${ext}`)
			.on('error', async err => {
				loadingmsg.delete();
				console.error(err);
				return message.channel.send(err, { code: true });
			})
			.on('end', output => {
				let file = fs.readFileSync(output).toString('hex');
				
				let searchHex = '6d766864';
				let replaceHex = '0000017FFFFFFF';
				let skipByte = 34;

				let endResult;

				if (ext === '.webm') {
					searchHex = '2ad7b1';
					replaceHex = '00000000';
					skipByte = 8;

					endResult = replaceAt(file, file.indexOf(searchHex) + file.substring(file.indexOf(searchHex)).indexOf('4489') + skipByte, replaceHex);
				} else {
					endResult = replaceAt(file, file.indexOf(searchHex) + skipByte, replaceHex);
				}

				fs.writeFileSync(`${os.tmpdir()}/cursed${message.id}${ext}`, Buffer.from(endResult, 'hex'));
				return message.channel.send(`Cursed by ${message.author}`, {files: [`${os.tmpdir()}/cursed${message.id}${ext}`]})
					.catch(err => {
						console.error(err);
						return message.channel.send('Video is too big! try again with something smaller');
					})
					.then(() => {
						loadingmsg.delete();
					});
			});

	}
}
module.exports = cursesCommand;