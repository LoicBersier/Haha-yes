const { Command } = require('discord-akairo');
const Tag = require('../../models').Tag;
const fs = require('fs');
const os = require('os');

class seetagCommand extends Command {
	constructor() {
		super('taglist', {
			aliases: ['seetag', 'taglist', 'tags'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
			channel: 'guild',
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
				content: 'Show the list of tag for this server. --all to get a txt file with info about every tag on the server',
				usage: '[name of tag]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (args.raw) {
			let tagList = await Tag.findOne({attributes: ['trigger','response','ownerID'], where: {trigger: args.raw, serverID: message.guild.id}});
			if (!tagList) return message.channel.send('Tag not found.');
			this.client.users.fetch(tagList.dataValues.ownerID)
				.then(user => {
					const TagEmbed = this.client.util.embed()
						.setColor(message.member ? message.member.displayHexColor : 'NAVY')
						.setTitle(message.guild.name)
						.addField('Trigger:', tagList['dataValues']['trigger'])
						.addField('Response:', tagList['dataValues']['response'])
						.addField('Creator:', `${user.username}#${user.discriminator} (${user.id})`);
		
					return message.channel.send(TagEmbed)
						.catch(() => {
							tagTxt(args.raw, tagList)
								.then(path => {
									return message.channel.send('This tag is to big to be shown on discord! Sending it as a file', {files: [path]});
								});
						});
				})
				.catch(() => {
					const TagEmbed = this.client.util.embed()
						.setColor(message.member ? message.member.displayHexColor : 'NAVY')
						.setTitle(message.guild.name)
						.addField('Trigger:', tagList['dataValues']['trigger'])
						.addField('Response:', tagList['dataValues']['response'])
						.addField('Creator:', 'No user info.');

					return message.channel.send(TagEmbed)
						.catch(() => {
							tagTxt(args.raw, tagList)
								.then(path => {
									return message.channel.send('This tag is to big to be shown on discord! Sending it as a file', {files: [path]});
								});
						});
				});
		} else if (args.all) {
			let tagList = await Tag.findAll({attributes: ['trigger','response','ownerID'], where: {serverID: message.guild.id}});
			if (!tagList[0]) return message.channel.send('This guild do not have any tag.');
			var tagArray = [];
			tagList.forEach(tag => {
				tagArray.push(tag.dataValues);
			});
			tagTxt('taglist', tagArray)
				.then(path => {
					return message.channel.send('Here are all your tags!', {files: [path]});
				});
		} else {
			let tagList = await Tag.findAll({attributes: ['trigger'], where: {serverID: message.guild.id}});
			const tagString = tagList.map(t => t.trigger).join(', ') || 'No tags set.';
			const TagEmbed = this.client.util.embed()
				.setColor(message.member ? message.member.displayHexColor : 'NAVY')
				.setTitle('List of tags')
				.setDescription(tagString)
				.setFooter('Use this command with the name of the tag to see more info about it!');
	
			return message.channel.send(TagEmbed)
				.catch(() => {
					tagTxt('tags', tagList)
						.then(path => {
							return message.channel.send('There is too much tag to be shown on discord! Sending it as a file', {files: [path]});
						});
				});
		}

		async function tagTxt(name, tagArray) {
			let path = `${os.tmpdir()}/${name.substring(0, 10)}.json`;
			fs.writeFile(path,JSON.stringify(tagArray, null, 2), function(err) {
				if (err) return console.error(err);
			});
			return path;
		}
	}
}
module.exports = seetagCommand;