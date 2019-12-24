const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const boards = require('4chan-boards');
const htmlToText = require('html-to-text');

class FourchanCommand extends Command {
	constructor() {
		super('4chan', {
			aliases: ['4chan'],
			clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
			category: 'fun',
			
			args: [
				{
					id: 'board',
					type: 'string',
					prompt: {
						start: 'which board do you want to browse?',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Send random images from a 4chan board of your choosing',
				usage: '[board]',
				examples: ['vg']
			}
		});
	}

	async exec(message, args) {
		if (boards.getType(args.board) === boards.NSFW && !message.channel.nsfw) return message.channel.send('Sorry, this board only work in nsfw channel!');

		if (!args.board) return;
		
		let i = Math.floor((Math.random() * 5) + 1);


		fetch(`https://a.4cdn.org/${args.board}/${i}.json`).then((response) => {
			return response.json();
		}).then((response) => { 
			if (!response.threads)
				return message.channel.send('Not a valid board');

			i = Math.floor((Math.random() * response.threads.length) + 1);

			// If post is sticky search again
			while(response.threads[i].posts[0].sticky == 1 || !response.threads[i].posts) {
				i = Math.floor((Math.random() * response.threads.length));
			}

			let title = response.threads[i].posts[0].sub;
			let description = response.threads[i].posts[0].com;
			let boardName = boards.getName(args.board);
			if (boardName == undefined) boardName = args.board;

			// If title or description is undefined, change it to "no title/description"
			if (!description) {
				description = 'No description';
			}

			if (!title) {
				title = 'No title';
			}

			const FourchanEmbed = this.client.util.embed()
				.setColor(message.member.displayHexColor)
				.setTitle(title)
				.setDescription(htmlToText.fromString(description))
				.setImage(`https://i.4cdn.org/${args.board}/${response.threads[i].posts[0].tim}${response.threads[i].posts[0].ext}`)
				.setURL(`https://boards.4chan.org/${args.board}/thread/${response.threads[i].posts[0].no}/${response.threads[i].posts[0].semantic_url}`)
				.setFooter(`${boardName} | ${response.threads[i].posts[0].name} | ${response.threads[i].posts[0].no}  | ${response.threads[i].posts[0].now}`);
				
			// If file type dosen't work on embed, send it as a link
			if (response.threads[i].posts[0].ext == '.webm' || response.threads[i].posts[0].ext == '.pdf' || response.threads[i].posts[0].ext == '.swf') {
				message.channel.send(FourchanEmbed);
				message.channel.send(`https://i.4cdn.org/${args.board}/${response.threads[i].posts[0].tim}${response.threads[i].posts[0].ext}`);

			} else {
				message.channel.send(FourchanEmbed);
			}
		})
			.catch((err) => {
				if (err.type == 'invalid-json') return message.channel.send('Could not find the board');
				console.error(err);
				return message.channel.send('Uh-oh, an error has occured and i don\'t know why!');
			});
	}
}
module.exports = FourchanCommand;