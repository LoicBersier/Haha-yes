import utils from './downloadutils.js';

if (process.platform !== 'linux' && process.argv[2] !== '-f') {
	console.error('This script only download the linux version of yt-dlp. If you want to download anyway try again with -f');
	process.exit(1);
}
else if (process.platform !== 'linux' && process.argv[2] === '-f') {
	console.log('Executed with -f. Reminder that this script only download the linux version of yt-dlp.');
}

const downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

utils.download(downloadUrl, './bin/yt-dlp');
