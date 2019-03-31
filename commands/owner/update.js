const { Command } = require('discord-akairo');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { MessageEmbed } = require('discord.js');

class EvalCommand extends Command {
	constructor() {
		super('update', {
			aliases: ['update', 'pull', 'git pull'],
			category: 'owner',
			ownerOnly: 'true',
			description: {
				content: 'Update the bot with git pull',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		async function update() {
			const { stdout, stderr } = await exec('git pull');
			const Embed = new MessageEmbed()
				.addField('stdout', stdout)
				.addField('stderr', stderr);
			message.channel.send({embed: Embed});
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
		}
		update();
	}
}

module.exports = EvalCommand;