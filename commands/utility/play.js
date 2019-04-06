const { Command } = require('discord-akairo');
const ytdl = require('ytdl-core');

class playCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play'],
			category: 'utility',
			args: [
				{
					id: 'ytblink',
					type: 'string',
					match: 'rest',
				}
			],
			description: {
				content: 'play music from the link you send ( This command might or might not stay in the bot, as it is basic, if people abuse it e.g: making play 10 hours song just for the purpose of making the bot slow, i will remove this command! )',
				usage: '[youtube link]',
				examples: ['https://www.youtube.com/watch?v=mzHWLLn5Z4A']
			}
		});
	}

	async exec(message, args) {
		const voiceChannel = message.member.voice.channel;

		//  If not in voice channel ask user to join
		if (!voiceChannel) {
			return message.reply('please join a voice channel first!');
						
		} else 
		//  If user say "stop" make the bot leave voice channel
		if (args.ytblink == 'stop') {
			voiceChannel.leave();
			return message.channel.send('I left the channel');
		} else
			voiceChannel.join().then(connection => {
				const stream = ytdl(args.ytblink, { filter: 'audioonly' });
				const dispatcher = connection.play(stream);
				message.channel.send('Playing it now!');
				//  End at then end of the audio stream
				dispatcher.on('end', () => {
					voiceChannel.leave();
					return message.channel.send('Music ended, i left the channel');
				});
			});
	}
}

module.exports = playCommand;