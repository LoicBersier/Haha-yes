const { Command } = require('discord-akairo');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os');
const rand = require('../../../rand.js');

class dectalkCommand extends Command {
	constructor() {
		super('dectalk', {
			aliases: ['dectalk', 'dec'],
			category: 'fun',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'decMessage',
					type: 'string',
					prompt: {
						start: 'Write something so i can say it back in dectalk',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Send a wav of what you wrote into .wav with dectalk',
				usage: '[text]',
				examples: ['This command is very epic']
			}
		});
	}

	async exec(message, args) {
		let output = `${os.tmpdir()}/${message.id}_dectalk.wav`;
		args.decMessage = rand.random(args.decMessage, message);
		args.decMessage = args.decMessage.replace('\n', ' ');
		let decMessage = '[:phoneme on] ' + args.decMessage.replace(/(["'$`\\])/g,'\\$1');

		if (process.platform == 'win32') {
			exec(`cd .\\dectalk && .\\say.exe -w ${output} "${decMessage}"`)
				.catch(err => {
					console.error(err);
					return message.channel.send('Oh no! an error has occurred!');
				})
				.then(() => {
					return message.channel.send({files: [output]});
				});
		} else if (process.platform == 'linux' || process.platform == 'darwin') {
			let loadingmsg = await message.channel.send('Processing ( this can take some time ) <a:loadingmin:527579785212329984>');

			exec(`cd dectalk && DISPLAY=:0.0 wine say.exe -w ${output} "${decMessage}"`)
				.catch(err => {
					loadingmsg.delete();
					console.error(err);
					return message.channel.send('Oh no! an error has occurred!');
				})
				.then(() => {
					loadingmsg.delete();
					return message.channel.send({files: [output]});
				});
		}
	}
}

module.exports = dectalkCommand;