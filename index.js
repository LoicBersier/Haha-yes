const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { token } = require('./config.json');

const client = new CommandoClient({
	commandPrefix: 'haha ',
	owner: '267065637183029248',
	invite: 'https://discord.gg/bRCvFy9',
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['first', 'Your First Command Group'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

client.on('error', console.error);

client.login(token);