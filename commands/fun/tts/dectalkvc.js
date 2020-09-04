const { Command } = require('discord-akairo');
const { execFile } = require('child_process');
const rand = require('../../../rand.js');

class dectalkvcCommand extends Command {
	constructor() {
		super('dectalkvc', {
			aliases: ['dectalkvc', 'decvc'],
			category: 'fun',
			clientPermissions: ['SPEAK'],
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
				content: 'Repeat what you sent in the voice chat you are currently in',
				usage: '[text]',
				examples: ['This command is very epic']
			}
		});
	}

	async exec(message, args) {
		args.decMessage = rand.random(args.decMessage, message);
		let output = `${message.id}_dectalk.wav`;
		let decMessage = '[:phoneme on] ' + args.decMessage;
		let loadingmsg = await message.channel.send('Processing ( this can take some time ) <a:loadingmin:527579785212329984>');

		if (process.platform === 'win32') {
			execFile('say.exe', ['-w', output, `${decMessage}`], {cwd: './dectalk/'}, async (error, stdout, stderr) => {
				if (error) {
					loadingmsg.delete();
					console.error(stdout);
					console.error(stderr);
					console.error(error);
					return message.channel.send('Oh no! an error has occurred!');
				}

				loadingmsg.delete();
				playinVC(`./dectalk/${output}`);
			});
			
		} else if (process.platform === 'linux' || process.platform === 'darwin') {
			execFile('wine', ['say.exe', '-w', output, `${decMessage}`], {cwd: './dectalk/'}, async (error, stdout, stderr) => {
				if (error) {
					loadingmsg.delete();
					console.error(stdout);
					console.error(stderr);
					console.error(error);
					return message.channel.send('Oh no! an error has occurred!');
				}

				loadingmsg.delete();
				playinVC(`./dectalk/${output}`);
			});
		}

		async function playinVC(file) {
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) return message.channel.send('Please enter a voice channel first.');
			try {
				const connection = await voiceChannel.join();
				const dispatcher = connection.play(file);
				dispatcher.once('finish', () => voiceChannel.leave());
				dispatcher.once('error', () => voiceChannel.leave());
				return null;
			} catch (err) {
				voiceChannel.leave();
				return message.reply(`Oh no, an error occurred: \`${err.message}\`.`);
			}
		}
	}
}

module.exports = dectalkvcCommand;