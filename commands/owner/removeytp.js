const { Command } = require('discord-akairo');
const fs = require('fs');
const md5File = require('md5-file');
const ytpHash = require('../../models').ytpHash;



class removeytpCommand extends Command {
	constructor() {
		super('removeytp', {
			aliases: ['removeytp', 'rytp', 'ytpr'],
			category: 'owner',
			ownerOnly: 'true',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'messageID',
					type: 'number'
				}
			],
			description: {
				content: 'Delete a ytp',
				usage: '[message id]',
				examples: ['some message id']
			}
		});
	}

	async exec(message, args) {
		const hash = md5File.sync(args.filePath);
		const ytphash = await ytpHash.findOne({where: {hash: hash}});

		if (ytphash) {
			await ytpHash.destroy({where: {hash: hash}});
		}

		fs.unlinkSync(`./asset/ytp/userVid/${args.messageID}.mp4`);
		return message.channel.send('Successfully removed the video.');
	}
}

module.exports = removeytpCommand;
