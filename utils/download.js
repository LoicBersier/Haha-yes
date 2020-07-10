const fs = require('fs');
const events = require('events');
const youtubedl = require('youtube-dl');

module.exports = function (url, option, output) {
	let eventEmitter = new events.EventEmitter();

	if (!url) eventEmitter.emit('error', 'Require an url!');
	if (!output) eventEmitter.emit('error', 'Require an output parameter! (If you see this message please send a feedback to the dev about it.)\'');

	if (option != null) option.push('--rm-cache-dir');
	else option = ['--rm-cache-dir'];

	const video = youtubedl(url, option);

	video.on('error', function error(err) {
		console.log(err.toString());
		eventEmitter.emit('error', err.toString());
	});

	video.pipe(fs.createWriteStream(output));

	video.on('end', function() {
		eventEmitter.emit('end', output);
	});
	return eventEmitter;
};

