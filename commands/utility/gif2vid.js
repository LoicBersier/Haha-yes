const { Command } = require('discord-akairo');
const fs = require('fs');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const superagent = require('superagent');

class gif2vidCommand extends Command {
	constructor() {
		super('gif2vid', {
			aliases: ['gif2vid', 'g2v', 'gv'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'vid',
					type: 'string'
				}
			],
			description: {
				content: 'Transform gif into video.',
				usage: '[link to gif]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {


		let Attachment = (message.attachments).array();
		let vid = args.vid;
		// Get attachment link
		if (Attachment[0] && !args.vid) {
			vid = Attachment[0].url;
		}

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		if (!vid) {
			loadingmsg.delete();
			return message.channel.send('I need a gif to do that!');
		} else if (vid) {

			const { body: buffer } = await superagent.get(vid).catch(() => {
				loadingmsg.delete();
				return message.channel.send('An error as occured, please try again');
			});


			fs.writeFile(`${os.tmpdir()}/${message.id}g2v.gif`, buffer, () => {
				exec(`ffmpeg -i ${os.tmpdir()}/${message.id}g2v.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${os.tmpdir()}/${message.id}g2v.mp4 -hide_banner`)
					.then(() => {
						loadingmsg.delete();
						message.delete();
						return message.channel.send({files: [`${os.tmpdir()}/${message.id}g2v.mp4`]})
							.catch(err => {
								console.error(err);
								loadingmsg.delete();
								return message.channel.send('Could not send the file! Perhaps the file is too big?');
							});
					})
					.catch(err => {
						console.error(err);
						loadingmsg.delete();
						return message.channel.send('There was an error during conversion!');
					});
			});

		}

	}
}

module.exports = gif2vidCommand;