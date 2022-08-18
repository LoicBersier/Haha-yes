import fs from 'node:fs';
import https from 'node:https';

if (process.platform !== 'linux' && process.argv[2] !== '-f') {
	console.error('This script only download the linux version of yt-dlp. If you want to download anyway try again with -f');
	process.exit(1);
}
else if (process.platform !== 'linux' && process.argv[2] === '-f') {
	console.log('Executed with -f. Reminder that this script only download the linux version of yt-dlp.');
}

const downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

download(downloadUrl);

async function download(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			if (res.statusCode === 301 || res.statusCode === 302) {
				console.log(`yt-dlp download url: ${res.headers.location}`);
				return download(res.headers.location);
			}

			const tmpPath = './bin/yt-dlp.new';
			const path = './bin/yt-dlp';
			const filePath = fs.createWriteStream(tmpPath);
			res.pipe(filePath);
			filePath.on('finish', () => {
				filePath.close();
				fs.renameSync(tmpPath, path);
				fs.chmodSync('./bin/yt-dlp', '755');
				console.log('yt-dlp download finished.');
				resolve(true);
			});
			filePath.on('error', (err) => {
				filePath.close();
				reject(err);
			});
		});
	});
}