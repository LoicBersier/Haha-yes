const { Command } = require('discord-akairo');
const { execFile } = require('child_process');
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
		args.decMessage = rand.random(args.decMessage, message);
		let output = `${os.tmpdir()}/${message.id}_dectalk.wav`;
		let decMessage = '[:phoneme on]' + args.decMessage;
		let loadingmsg = await message.channel.send('Processing ( this can take some time ) <a:loadingmin:527579785212329984>');

		if (process.platform === 'win32') {
			execFile('say.exe', ['-w', output, `${decMessage}`], {cwd: './dectalk/'}, (error, stdout, stderr) => {
				if (error) {
					loadingmsg.delete();
					console.error(stdout);
					console.error(stderr);
					console.error(error);
					return message.channel.send('Oh no! an error has occurred!');
				}

				loadingmsg.delete();
				return message.channel.send({files: [output]});
			});
		} else if (process.platform === 'linux' || process.platform === 'darwin') {
			execFile('wine', ['say.exe', '-w', output, `${decMessage}`], {cwd: './dectalk/'}, (error, stdout, stderr) => {
				if (error) {
					loadingmsg.delete();
					console.error(stdout);
					console.error(stderr);
					console.error(error);
					return message.channel.send('Oh no! an error has occurred!');
				}

				loadingmsg.delete();
				return message.channel.send({files: [output]});
			});
		}
	}
}

module.exports = dectalkCommand;