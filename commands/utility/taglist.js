const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const reload = require('auto-reload');
const fs = require('fs');

class taglistCommand extends Command {
	constructor() {
		super('taglist', {
			aliases: ['taglist'],
			category: 'utility',
			channelRestriction: 'guild',
			description: {
				content: 'Show the list of tag for this server.',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		let customresponse = reload(`../../tag/${message.guild.id}.json`);
		let count = Object.keys(customresponse).length;


		await fs.readFile(`./tag/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log(err);
				fs.close(2);
				return;
			}
			let json = JSON.stringify(data);
			json = json.replace(/[{}'\\]+/g, '');
			json = json.replace(/,+/g, '\n');
			const tagEmbed = new Discord.RichEmbed()
				.setColor('#ff9900')
				.setTitle('Tags list')
				.setDescription(`Trigger:Response\n\n${json}`)
				.setFooter(`You have ${count} tags on this server`);

			message.channel.send(tagEmbed);
		});
		fs.close(2);
		message.channel.send('An error has occured, do you have any tags on the server?');
	}
}

module.exports = taglistCommand;