const { Command } = require('discord-akairo');
const Tag = require('../../models').Tag;

class TagCommand extends Command {
	constructor() {
		super('tag', {
			aliases: ['tag'],
			category: 'admin',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'trigger',
					type: 'string',
					prompt: {
						start: 'What word or sentence should trigger it?',
					}
				},
				{
					id: 'response',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'What word or sentence should the response be?',
					}
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Create custom autoresponse  [Click here to see the complete list of "tag"](https://cdn.discordapp.com/attachments/502198809355354133/561043193949585418/unknown.png) (Need "" if the trigger contains spaces)',
				usage: '[trigger] [response]',
				examples: ['"do you know da wea" Fuck off dead meme', 'hello Hello [author], how are you today?']
			}
		});
	}

	async exec(message, args) {
		const tag = await Tag.findOne({where: {trigger: args.trigger, serverID: message.guild.id}});

		if (!tag) {
			const body = {trigger: args.trigger, response: args.response, ownerID: message.author.id, serverID: message.guild.id};
			await Tag.create(body);
			return message.channel.send(`tag have been set to ${args.trigger} : ${args.response}`);
		} else {
			message.channel.send('This tag already exist, do you want to update it? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000, max: 1, errors: ['time'] })
				.then(async messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent == 'y' || messageContent == 'yes') {
						const body = {trigger: args.trigger, response: args.response, ownerID: message.author.id, serverID: message.guild.id};
						await Tag.update(body, {where: {trigger: args.trigger, serverID: message.guild.id}});
						return message.channel.send(`tag have been set to ${args.trigger} : ${args.response}`);
					}
				})
				.catch(() => {
					return message.channel.send('Took too long to answer. didin\'t update anything.');
				});
		}
	}
}

module.exports = TagCommand;