// This is kind of useless since you can just do `./yt-dlp --update-to nightly` which I didn't know about when I wrote that.
import utils from './downloadutils.js';

(async () => {
	if (process.platform !== 'linux' && process.argv[2] !== '-f') {
		console.error('This script only download the linux version of yt-dlp. If you want to download anyway try again with -f or execute ./bin/yt-dlp --update-to nightly');
		process.exit(1);
	}
	else if (process.platform !== 'linux' && process.argv[2] === '-f') {
		console.log('Executed with -f. Reminder that this script only download the linux version of yt-dlp.');
	}

	const downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

	await utils.download(downloadUrl, './bin/yt-dlp');

});
