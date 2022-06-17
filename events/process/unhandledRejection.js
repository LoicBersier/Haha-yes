export default {
	name: 'unhandledRejection',
	once: true,
	async execute(error) {
		console.error('Unhandled promise rejection:', error);
	},
};
