import { ActivityType } from 'discord.js';
import game from '../../json/playing.json' assert {type: 'json'};
import music from '../../json/listening.json' assert {type: 'json'};
import watch from '../../json/watching.json' assert {type: 'json'};

export default {
	name: 'ready',
	once: true,
	async execute(client) {
		// Bot status
		await setStatus();
		// Change status every 30 minutes
		setInterval(async () => {
			await setStatus();
		}, 1800000);

		async function setStatus() {
			const random = Math.floor((Math.random() * 3));
			let types, status;
			// Random "Watching" status taken from json
			if (random === 0) {
				console.log('Status type: \x1b[32mWatching\x1b[0m');

				status = watch[Math.floor((Math.random() * watch.length))];
				status = status + ' | Now with slash commands!';
				console.log(`Setting status to: ${status}`);
				types = [ ActivityType.Watching ];
			}
			// Random "Playing" status taken from json
			else if (random === 1) {
				console.log('Status type: \x1b[32mPlaying\x1b[0m');

				status = game[Math.floor((Math.random() * game.length))];
				status = status + ' | Now with slash commands!';

				console.log(`Setting status to: ${status}`);
				types = [ ActivityType.Playing, ActivityType.Competing ];
			}
			else if (random === 2) {
				console.log('Status type: \x1b[32mPlaying\x1b[0m');

				status = music[Math.floor((Math.random() * music.length))];
				status = status + ' | Now with slash commands!';

				console.log(`Setting status to: ${status}`);
				types = [ ActivityType.Listening ];
			}
			await client.user.setActivity(status, { type: types[Math.floor((Math.random() * types.length))] });
		}
	},
};