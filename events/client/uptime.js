import https from 'node:https';
const { uptimeURL, uptimeInterval } = process.env;

export default {
	name: 'ready',
	once: true,
	async execute(client) {
		if (uptimeURL != '') {
			const interval = uptimeInterval ? uptimeInterval : 60;
			console.log(`Sending uptime to ${uptimeURL} every ${interval} seconds.`);
			pingStatus(client, 'Starting', 'Starting up');

			setInterval(() => {
				pingStatus(client, 'up', 'OK');
			}, interval * 1000);
		}
		else {
			console.error('No uptime url set up.');
		}
	},
};

async function pingStatus(client, status, msg) {
	https.get(`${uptimeURL}?status=${status}&msg=${msg}&ping=${Math.round(client.ws.ping)}`);
}