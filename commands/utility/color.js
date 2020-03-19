const { Command } = require('discord-akairo');

class colorCommand extends Command {
	constructor() {
		super('color', {
			aliases: ['color', 'colour'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
			channel: 'guild',
			args: [
				{
					id: 'color',
					prompt: {
						start: 'Please input a color, say `cancel` to stop the command'
					},
					type: 'string'
				}
			],
			description: {
				content: 'Set your rank to a specified hex value OR (ColorResolvable)[https://discord.js.org/#/docs/main/master/typedef/ColorResolvable]',
				usage: '[hex color OR ColorResolvable]',
				examples: ['#FF0000', 'WHITE']
			}
		});
	}

	async exec(message, args) {
		let ColorResolvable = [
			'default',
			'white',
			'aqua',
			'green',
			'blue',
			'yellow',
			'purple',
			'luminous_vivid_pink',
			'gold',
			'orange',
			'red',
			'grey',
			'darker_grey',
			'navy',
			'dark_aqua',
			'dark_green',
			'dark_blue',
			'dark_purple',
			'dark_vivid_pink',
			'dark_gold',
			'dark_orange',
			'dark_red',
			'dark_grey',
			'light_grey',
			'dark_navy'
		];

		let colors = [
			'black'
		];

		if (args.color.match(/^#[0-9A-F]{6}$/i) || ColorResolvable.includes(args.color.toLowerCase()) || colors.includes(args.color.toLowerCase())) {
			let role = message.guild.roles.cache.find(role => role.name === args.color);
			if (!role) {
				message.guild.roles.create({
					data: {
						name: args.color,
						color: args.color.toUpperCase(),  
						permissions: 0              					
					},
					reason: 'Color command'
				});
				return message.channel.send('Role created! try again to apply it to yourself!');
			} else if (message.guild.member(message.author).roles.cache.has(role.id)) {
				message.guild.member(message.author).roles.remove(role);
				return message.channel.send('Role removed!');
			}
			/* For some reason this doesn't work.
			role = message.guild.roles.find(role => role.name === args.color);
			*/
			message.guild.member(message.author).roles.add(role);
			return message.channel.send('Role added!');
		} else {
			return message.channel.send(`${args.color} is not a valid color`);
		}
	}
}

module.exports = colorCommand;