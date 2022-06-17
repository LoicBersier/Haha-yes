const fs = require('node:fs');
const https = require('node:https');

console.log('Downloading latest version of yt-dlp');

const downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
download(downloadUrl);

function download(url) {
	https.get(url, (res) => {
		if (res.statusCode === 301 || res.statusCode === 302) {
			console.log(`yt-dlp download url: ${res.headers.location}`);
			return download(res.headers.location);
		}

		const path = './bin/yt-dlp';
		const filePath = fs.createWriteStream(path);
		res.pipe(filePath);
		filePath.on('finish', () => {
			filePath.close();
			fs.chmodSync('./bin/yt-dlp', '755');
			console.log('yt-dlp download finished.');
		});
		filePath.on('error', (err) => {
			filePath.close();
			console.error(err.message);
		});
	});
}