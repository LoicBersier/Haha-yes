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
					.addField('stdout', output.stdout)
					.addField('stderr', output.stderr);
				message.channel.send({embed: Embed})
					.catch(() => {
						message.channel.send(`stdout: ${output.stdout}\nstderr: ${output.stderr}`);
					});
				console.log(`stdout: ${output.stdout}`);
				console.error(`stderr: ${output.stderr}`);
			});
	}
}

module.exports = EvalCommand;