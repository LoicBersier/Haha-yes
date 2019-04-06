const { Command } = require('discord-akairo');
const ytdl = require('ytdl-core');

class playCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play'],
			category: 'utility',
			ownerOnly: 'true',
			args: [
				{
					id: 'ytblink',
					type: 'string',
					match: 'rest',
				}
			],
			description: {
				content: 'Play play from the link you send ( ONLY FOR TESTING NOW )',
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
			message.channel.send('I leaved the channel');
		} else
			voiceChannel.join().then(connection => {
				const stream = ytdl(args.ytblink, { filter: 'audioonly' });
				const dispatcher = connection.play(stream);
				//  End at then end of the audio stream
				dispatcher.on('end', () => voiceChannel.leave());
				message.channel.send('Music ended, Leaved the channel');
			});
	}
}

module.exports = playCommand;