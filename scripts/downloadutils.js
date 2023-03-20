import fs from 'node:fs';
import https from 'node:https';

export default {
	download,
};

async function download(url, output) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			if (res.statusCode === 301 || res.statusCode === 302) {
				console.log(`${output} download url: ${res.headers.location}`);
				return download(res.headers.location, output);
			}

			const path = output;
			const tmpPath = `${output}.new`;

			const filePath = fs.createWriteStream(tmpPath);
			res.pipe(filePath);
			filePath.on('finish', () => {
				filePath.close();
				fs.renameSync(tmpPath, path);
				fs.chmodSync(path, '755');
				console.log(`${url} download finished.`);
				resolve(true);
			});
			filePath.on('error', (err) => {
				filePath.close();
				reject(err);
			});
		});
	});
}