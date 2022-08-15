import game from '../../json/playing.json' assert {type: 'json'};
import watch from '../../json/watching.json' assert {type: 'json'};

export default {
	name: 'ready',
	once: true,
	async execute(client) {
		// Bot status
		setStatus();
		// Change status every 30 minutes
		setInterval(async () => {
			setStatus();
		}, 1800000);

		async function setStatus() {
			const random = Math.floor((Math.random() * 2));
			// Random "Watching" status taken from json
			if (random === 0) {
				console.log('Status type: \x1b[32mWatching\x1b[0m');

				const status = watch[Math.floor((Math.random() * watch.length))];
				console.log(`Setting status to: ${status}`);
				client.user.setActivity(status, { type: 'WATCHING' });
			}
			// Random "Playing" status taken from json
			else if (random === 1) {
				console.log('Status type: \x1b[32mPlaying\x1b[0m');

				const status = game[Math.floor((Math.random() * game.length))];
				console.log(`Setting status to: ${status}`);
				client.user.setActivity(status, { type: 'PLAYING' });
			}
		}
	},
};