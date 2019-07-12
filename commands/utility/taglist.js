const { Command } = require('discord-akairo');
const Tag = require('../../models').Tag;
const fs = require('fs');
const { MessageEmbed } = require('discord.js');


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
					id: 'all',
					match: 'flag',
					flag: '--all',
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
		if (args.raw) {
			let tagList = await Tag.findOne({attributes: ['trigger','response','ownerID'], where: {trigger: args.raw, serverID: message.guild.id}});
			this.client.users.fetch(tagList.dataValues.ownerID)
				.then(user => {
					const TagEmbed = new MessageEmbed()
						.setColor('#ff9900')
						.setTitle(message.guild.name)
						.addField('Trigger:', tagList['dataValues']['trigger'])
						.addField('Response:', tagList['dataValues']['response'])
						.addField('Creator:', `${user.username}#${user.discriminator} (${user.id})`);
		
					return message.channel.send(TagEmbed);
				});
		} else if (args.all) {
			let tagList = await Tag.findAll({attributes: ['trigger','response','ownerID'], where: {serverID: message.guild.id}});
			var tagArray = [];
			tagList.forEach(tag => {
				tagArray.push(tag.dataValues);
			});
			fs.writeFile('/tmp/tagslist.txt',JSON.stringify(tagArray, null, 2), function(err) {
				if (err) return console.error(err);
				return message.channel.send('Here are your tags', {files: ['/tmp/tagslist.txt']});
			});
		} else {
			let tagList = await Tag.findAll({attributes: ['trigger'], where: {serverID: message.guild.id}});
			const tagString = tagList.map(t => t.trigger).join(', ') || 'No tags set.';
			const TagEmbed = new MessageEmbed()
				.setColor('#ff9900')
				.setTitle('List of tags')
				.setDescription(tagString)
				.setFooter('Use this command with the name of the tag to see more info about it!');
	
			return message.channel.send(TagEmbed);
		}
	}
}
module.exports = taglistCommand;