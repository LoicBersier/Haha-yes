export default {
	name: 'uncaughtException',
	async execute(error) {
		return console.error(`\x1b[31mUncaughtException: ${error}\x1b[37m`);
	},
};
