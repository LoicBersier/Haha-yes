const { Command } = require('discord-akairo');
const Tag = require('../../models').Tag;
const fs = require('fs');


class taglistCommand extends Command {
	constructor() {
		super('taglist', {
			aliases: ['taglist', 'tags'],
			category: 'utility',
			channelRestriction: 'guild',
			args: [
				{
					id: 'raw',
					match: 'rest',
					optional: true
				},
				{
					id: 'list',
					match: 'flag',
					flag: '--list',
				}
			],
			description: {
				content: 'Show the list of tag for this server.',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (args.list) {
			let tagList = await Tag.findAll({attributes: ['trigger'], where: {serverID: message.guild.id}});
			const tagString = tagList.map(t => t.trigger).join(', ') || 'No tags set.';
			return message.channel.send(`List of tags:\n${tagString}`, {code: true});
		}

		if (args.raw) {
			let tagList = await Tag.findOne({attributes: ['trigger','response','ownerID'], where: {trigger: args.raw, serverID: message.guild.id}});

			return message.channel.send(JSON.stringify(tagList, null, 2), {code: true});
		} else {
			let tagList = await Tag.findAll({attributes: ['trigger','response','ownerID'], where: {serverID: message.guild.id}});
			let tagArray = [];
			tagList.forEach(tag => {
				tagArray.push(tag['dataValues']);
			});
			fs.writeFile('/tmp/tagslist.txt',JSON.stringify(tagArray, null, 2), function(err) {
				if (err) return console.error(err);
				return message.channel.send('Here are your tags', {files: ['/tmp/tagslist.txt']});
			});
		}

	}
}
module.exports = taglistCommand;