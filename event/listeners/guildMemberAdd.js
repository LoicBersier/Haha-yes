const { Listener } = require('discord-akairo');
const joinChannel = require('../../models').joinChannel;
const rand = require('../../rand.js');

class guildMemberAddListener extends Listener {
	constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd'
		});
	}

	async exec(member) {
		if (member.guild.id == 240843640375607296) {
			member.setNickname('fart piss');
		}


		const join = await joinChannel.findOne({where: {guildID: member.guild.id}});

		if (join) {
			const channel = this.client.channels.resolve(join.get('channelID'));

			let welcomeMessage = join.get('message');

			let invite = new RegExp(/(https?:\/\/)?(www\.)?discord(?:app\.com|\.gg)[/invite/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9-]{2,32})/g);

			
			let username = member.user.username;
			let user = member.user;
			if (username.match(invite)) {
				username = username.replace(/(https?:\/\/)?(www\.)?discord(?:app\.com|\.gg)[/invite/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9-]{2,32})/g, '[REDACTED]');
				user = username;
			}

			welcomeMessage = welcomeMessage.replace(/\[member\]/g, username);
			welcomeMessage = welcomeMessage.replace(/\[memberPing\]/g, user);
			welcomeMessage = welcomeMessage.replace(/\[server\]/g, member.guild.name);
			
			// add attachment
			let attach;
			if (welcomeMessage.includes('[attach:')) {
				attach = welcomeMessage.split(/(\[attach:.*?])/);
				for (let i = 0, l = attach.length; i < l; i++) {
					if (attach[i].includes('[attach:')) {
						attach = attach[i].replace('[attach:', '').slice(0, -1);
						i = attach.length;
					}
				}
				welcomeMessage = welcomeMessage.replace(/(\[attach:.*?])/, '');
			}
	
			welcomeMessage = rand.random(welcomeMessage);	
	
	
			if (attach) {
				return channel.send(welcomeMessage, {files: [attach]});
			} else {
				return channel.send(welcomeMessage);
			}
		}
	}
}
module.exports = guildMemberAddListener;