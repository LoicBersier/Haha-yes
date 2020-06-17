const fs = require('fs');
const youtubedl = require('youtube-dl');

module.exports = function (url, option, output) {
	return new Promise(function(resolve, reject) {
		if (!url) reject('Require a url!');
		if (!output) reject('Require an output parameter! (If you see this message please send a feedback to the dev about it.)');

		if (option != null) option.push('--rm-cache-dir');
		else option = ['--rm-cache-dir'];

		const video = youtubedl(url, option);

		video.on('error', function error(err) {
			console.log(err.toString());
			reject(err.toString());
		});

		video.pipe(fs.createWriteStream(output));

		video.on('end', function() {
			resolve(output);
		});
	});
};

