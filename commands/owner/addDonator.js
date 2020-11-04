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
				},
				{
					id: 'remove',
					match: 'flag',
					flag: ['--remove']
				}
			],
			channel: 'guild',
			description: {
				content: 'Add id to the list of people who donated',
				usage: '[userID] [userComment]',
				examples: []
			}
		});
	}

	async exec(message, args) {
		const Donator = await donator.findOne({where: {userID: args.id}});

		if (args.remove) {
			if (Donator) {
				Donator.destroy({where: {userID: args.id}});
				return message.channel.send('successfully removed the following id from the donators: ' + args.id);
			} else {
				return message.channel.send('Did not find the id, is he a donator?');
			}
		}

		let userComment = '';
		if (args.userComment) {
			userComment = args.userComment;
		} else if (!args.userComment) {
			userComment = '';
		}

		if (!Donator) {
			const body = {userID: args.id, comment: userComment};
			donator.create(body);
			return message.channel.send(`A new donator have been added! ${this.client.users.resolveID(args.id).tag} (${args.id}) ${userComment}`);
		} else {
			message.channel.send('This donator already exist, do you want to update it? y/n');
			const filter = m =>  m.content && m.author.id === message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
						const body = {comment: userComment};
						donator.update(body, {where: {userID: args.id}});
						console.log(userComment);
						if (userComment === '') {
							return message.channel.send(`Removed the comment from ${this.client.users.resolveID(args.id).tag} (${args.id})`);
						} else {
							return message.channel.send(`You edited the comment for ${this.client.users.resolveID(args.id).tag} (${args.id}) with ${args.userComment}`);
						}
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t update anything.');
				});
		}
	}
}

module.exports = addDonatorCommand;