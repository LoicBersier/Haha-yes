const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const boards = require('4chan-boards');

class FourchanCommand extends Command {
	constructor() {
		super('4chan', {
			aliases: ['4chan'],
			category: 'fun',
			
			args: [
				{
					id: 'board',
					type: 'string',
					prompt: {
						start: 'Wich board do you want to browse?',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Send random images from a 4chan board of your choosing (only in nsfw channel)',
				usage: '[board]',
				examples: ['vg']
			}
		});
	}

	async exec(message, args) {
		if (boards.getType(args.board) === boards.NSFW && !message.channel.nsfw) return message.channel.send('Sorry, this board only work in nsfw channel!');

		if (!args.board) return;
		
		fetch(`https://a.4cdn.org/${args.board}/1.json`).then((response) => {
			return response.json();
		}).then((response) => { 
			if (!response.threads)
				return message.channel.send('Not a valid board');

			let i = Math.floor((Math.random() * response.threads.length));

			let description = response.threads[i].posts[0].com.replace(/(<([^>]+)>)/ig,'');
			description = decodeURI(description);

			const FourchanEmbed = new MessageEmbed()
				.setColor('#ff9900')
				.setTitle(`${response.threads[i].posts[0].name} | ${response.threads[i].posts[0].no}`)
				.setDescription(description)
				.setImage(`https://i.4cdn.org/${args.board}/${response.threads[i].posts[0].tim}${response.threads[i].posts[0].ext}`)
				.setURL(`https://boards.4chan.org/${args.board}/thread/${response.threads[i].posts[0].no}/${response.threads[i].posts[0].semantic_url}`)
				.setFooter(`${boards.getName(args.board)} | ${response.threads[i].posts[0].now}`)
				.setTimestamp();
				
			message.channel.send(FourchanEmbed);
		});
	}
}
module.exports = FourchanCommand;