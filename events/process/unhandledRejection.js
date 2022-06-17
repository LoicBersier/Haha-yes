export default {
	name: 'unhandledRejection',
	async execute(error) {
		return console.error(`\x1b[31mUncaught Promise Rejection: ${error}\x1b[37m`);
	},
};
