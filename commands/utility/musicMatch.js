const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fpcalc = require('fpcalc');
const fetch = require('node-fetch');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const { acoustID } = require('../../config.json');


class musicCommand extends Command {
	constructor() {
		super('musicMatch', {
			aliases: ['musicMatch', 'music', 'shazam', 'soundhound'],
			category: 'utility',
			quoted: false,
			args: [
				{
					id: 'music',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Find what music it is from attachment or link',
				usage: '[file]',
				examples: ['[file]']
			}
		});
	}

	async exec(message,args) {
		let link;
		let Attachment = (message.attachments).array();



		if (!args.music && Attachment[0]) {
			if (!Attachment[0].url.endsWith('mp3' || 'wav' || 'mp4' || 'webm'))
				return message.channel.send('Only mp3,wav,mp4 and webm are supported');
			link = Attachment[0].url;
		} else {
			link = args.music;
			if (!link.endsWith('mp3' || 'wav' || 'mp4' || 'webm'))
				return message.channel.send('Only mp3,wav,mp4 and webm are supported');
		}

		let video = youtubedl(link, ['-x', '--audio-format', 'mp3']);
		video.pipe(fs.createWriteStream('./music.mp3'));
		video.on('error', function error(err) {
			console.log('error 2:', err);
			message.channel.send('An error has occured, I can\'t download from the link you provided.');
		});
		video.on('end', function () {
			fpcalc('./music.mp3', function(err, result) {
				if (err) throw err;
				fetch(`https://api.acoustid.org/v2/lookup?client=${acoustID}&meta=recordings+releasegroups+compress&duration=${result.duration}&fingerprint=${result.fingerprint}`).then((response) => {
					return response.json();
				}).then((response) => { 
					if (!response.results[0])
						return message.channel.send('Could not identify the music');

					let time = response.results[0].recordings[0].duration;
					let minutes = Math.floor(time / 60);
					let seconds = time - minutes * 60;

					const musicEmbed = new MessageEmbed()
						.setColor('#ff9900')
						.setTitle('Music found!')
						.addField('Title', response.results[0].recordings[0].title, true)
						.addField('Artist', response.results[0].recordings[0].artists[0].name, true)
						.addField('Album', response.results[0].recordings[0].releasegroups[0].title, true)
						.addField('Duration', `${minutes}:${seconds}`);
						
						
					message.channel.send(musicEmbed);
				});
			});
		});
	}
}

module.exports = musicCommand;