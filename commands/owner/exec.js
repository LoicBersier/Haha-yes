const { Command } = require('discord-akairo');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class execCommand extends Command {
	constructor() {
		super('exec', {
			aliases: ['exec'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'exec',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'execute a command on the server',
				usage: '[a command on the server]',
				examples: ['pm2 list']
			}
		});
	}

	async exec(message, args) {
		async function update() {
			const { stdout, stderr } = await exec(args.exec).catch(err => {
				return message.channel.send(`Oh no, an error has occured\n${err}`);
			});
			message.channel.send(`stdout: ${stdout}`, { split: true });
			message.channel.send(`stderr: ${stderr}`, { split: true });
		}
		return update();
	}
}

module.exports = execCommand;