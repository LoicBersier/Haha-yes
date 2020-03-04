const { Command } = require('discord-akairo');
const donator = require('../../models').donator;

class addDonatorCommand extends Command {
	constructor() {
		super('addDonator', {
			aliases: ['addDonator'],
			category: 'owner',
			ownerOnly: 'true',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'id',
					type: 'string',
					prompt: {
						start: 'What is the ID of the user who should be added to the list?',
					}
				},
				{
					id: 'userComment',
					type: 'string',
					match: 'rest'
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Add id to the list of people who donated',
				usage: '[userID] [userComment]',
				examples: []
			}
		});
	}

	async exec(message, args) {
		let userComment = '';
		if (args.userComment) {
			userComment = args.userComment;
		} else if (!args.userComment) {
			userComment = '';
		}
		const Donator = await donator.findOne({where: {userID: args.id}});

		if (!Donator) {
			const body = {userID: args.id, comment: userComment};
			donator.create(body);
			return message.channel.send(`A new donator have been added! ${this.client.users.resolve(args.id).username}#${this.client.users.resolve(args.id).discriminator} (${args.id}) ${userComment}`);
		} else {
			message.channel.send('This donator already exist, do you want to update it? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent == 'y' || messageContent == 'yes') {
						const body = {comment: userComment};
						donator.update(body, {where: {userID: args.id}});
						console.log(userComment);
						if (userComment == '') {
							return message.channel.send(`Removed the comment from ${this.client.users.resolve(args.id).username}#${this.client.users.resolve(args.id).discriminator} (${args.id})`);
						} else {
							return message.channel.send(`You edited the comment for ${this.client.users.resolve(args.id).username}#${this.client.users.resolve(args.id).discriminator} (${args.id}) with ${args.userComment}`);
						}
					}
				})
				.catch(() => {
					return message.channel.send('Took too long to answer. didin\'t update anything.');
				});
		}
	}
}

module.exports = addDonatorCommand;