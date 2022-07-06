import os from 'node:os';
import { exec } from 'node:child_process';

export default {
	downloadVideo,
	upload,
	ffmpeg,
	stringIsAValidurl,
};
async function downloadVideo(urlArg, output, format = 'bestvideo*+bestaudio/best') {
	await new Promise((resolve, reject) => {
		exec(`./bin/yt-dlp -f ${format} "${urlArg}" -o "${os.tmpdir()}/${output}.%(ext)s" --force-overwrites --no-playlist`, (err, stdout, stderr) => {
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

async function stringIsAValidurl(s) {
	try {
		new URL(s);
		return true;
	}
	catch (err) {
		return false;
	}
}
