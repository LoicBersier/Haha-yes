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
		async function update() {
			const { stdout, stderr } = await exec('git pull');
			const Embed = this.client.util.embed()
				.addField('stdout', stdout)
				.addField('stderr', stderr);
			message.channel.send({embed: Embed})
				.catch(() => {
					message.channel.send(`stdout: ${stdout}\nstderr: ${stderr}`);
				});
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
		}
		update();
	}
}

module.exports = EvalCommand;