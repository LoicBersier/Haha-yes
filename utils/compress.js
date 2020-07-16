const hbjs = require('handbrake-js');
const events = require('events');
// Compress submitted video
module.exports = function(input, output) {
	let eventEmitter = new events.EventEmitter();

	if (!input) eventEmitter.emit('error', 'Require an input file! (If you see this message please send a feedback to the dev about it.)');
	if (!output) eventEmitter.emit('error', 'Require an output parameter! (If you see this message please send a feedback to the dev about it.)');

	const options = {
		input: input,
		output: output,
		preset: 'Web/Discord Tiny 5 Minutes 240p30'
	};

	let handbrake = hbjs.spawn(options);

	handbrake.on('progress', progress => {
		eventEmitter.emit('progress', progress);
	});

	handbrake.on('error', err => {
		console.log(err);
		eventEmitter.emit('error', err);
	});

	handbrake.on('end', async function () {
		eventEmitter.emit('end', output);
	});
	return eventEmitter;
};
