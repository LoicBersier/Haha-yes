import db from '../../models/index.js';
import { rand } from '../../utils/rand.js';

export default {
	name: 'guildMemberRemove',
	async execute(member, client) {
		const isOptOut = await db.optout.findOne({ where: { userID: member.user.id } });

		if (isOptOut) return;

		const leave = await db.leaveChannel.findOne({ where: { guildID: member.guild.id } });

		if (leave) {
			const channel = client.channels.resolve(leave.get('channelID'));

			let welcomeMessage = leave.get('message');

			const invite = new RegExp(/(https?:\/\/)?(www\.)?discord(?:app\.com|\.gg)[/invite/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9-]{2,32})/g);


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

			welcomeMessage = rand(welcomeMessage);


			if (attach) {
				return channel.send({ content: welcomeMessage, files: [attach] });
			}
			else {
				return channel.send({ content: welcomeMessage });
			}
		}
	},
};