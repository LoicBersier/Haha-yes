import os from 'node:os';
import { exec } from 'node:child_process';

export default {
	downloadVideo,
	upload,
	ffmpeg,
};
async function downloadVideo(url, output, format = 'bestvideo*+bestaudio/best') {
	await new Promise((resolve, reject) => {
		exec(`./bin/yt-dlp -f ${format} ${url} -o "${os.tmpdir()}/${output}.%(ext)s" --force-overwrites`, (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			resolve(stdout);
		});
	});
}

async function upload(file) {
	return await new Promise((resolve, reject) => {
		exec(`./bin/upload.sh ${file}`, (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			resolve(stdout);
		});
	});
}

async function ffmpeg(command) {
	return await new Promise((resolve, reject) => {
		exec(`ffmpeg ${command}`, (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			resolve(stdout);
		});
	});
}