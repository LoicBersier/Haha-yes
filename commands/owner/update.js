const { Command } = require('discord-akairo');
const Util = require('util');
const exec = Util.promisify(require('child_process').exec);

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
		await exec('git pull')
			.then(output => {
				const Embed = this.client.util.embed()
					.addField('stdout', output.stdout ? output.stdout : 'No update')
					.addField('stderr', output.stderr ? output.stderr : 'No error');
				message.channel.send({embed: Embed})
					.catch(() => {
						message.channel.send(`stdout: ${output.stdout}\nstderr: ${output.stderr}`);
					});
			});
	}
}

module.exports = EvalCommand;