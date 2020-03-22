const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class RedditCommand extends Command {
	constructor() {
		super('reddit', {
			aliases: ['reddit'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			args: [
				{
					id: 'sub',
					type: 'string',
					prompt: {
						start: 'What subreddit do you want to browse?',
						optional: true
					},
					default: 'random',
					match: 'rest'
				}
			],
			description: {
				content: 'Send random images from the subreddit you choose',
				usage: '[subreddit]',
				examples: ['2meirl4meirl']
			}
		});
	}

	async exec(message, args) {
		//let i = 0;
		//let a = 0;
		if (!args.sub)
			return;
		
		fetch('https://www.reddit.com/r/' + args.sub + '.json?limit=100').then((response) => {
			return response.json();
		}).then((response) => { 
			console.log(response);
			if (response.error == 404)
				return message.channel.send('Not a valid subreddit');

			if (response.data.dist == 0)
				return message.channel.send('Not a valid subreddit');

			let i = Math.floor((Math.random() * response.data.children.length));
			if (response.data.children[i].data.over_18 == true && !message.channel.nsfw)
				return message.channel.send('No nsfw');
			const redditEmbed = this.client.util.embed()
				.setColor(message.member ? message.member.displayHexColor : 'NAVY')
				.setTitle(response.data.children[i].data.title)
				.setDescription(response.data.children[i].data.selftext)
				.setURL('https://reddit.com' + response.data.children[i].data.permalink)
				.setFooter(`/r/${response.data.children[i].data.subreddit} | ⬆ ${response.data.children[i].data.ups} 🗨 ${response.data.children[i].data.num_comments}`);
				
			message.channel.send(redditEmbed);
			message.channel.send(response.data.children[i].data.url);
		});
	}
}
module.exports = RedditCommand;