import os from 'node:os';
import { exec } from 'node:child_process';
const { NODE_ENV } = process.env;

export default {
	downloadVideo,
	upload,
	ffmpeg,
	stringIsAValidurl,
	compressVideo,
};
async function downloadVideo(urlArg, output, format = 'bestvideo*+bestaudio/best') {
	await new Promise((resolve, reject) => {
		exec(`./bin/yt-dlp -f ${format} "${urlArg}" -o "${os.tmpdir()}/${output}.%(ext)s" --force-overwrites --no-playlist --merge-output-format=mp4/webm/mov`, (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			console.log(NODE_ENV === 'development' ? stdout : null);
			resolve();
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
			console.log(NODE_ENV === 'development' ? stdout : null);
			resolve();
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

async function compressVideo(input, output, preset) {
	await new Promise((resolve, reject) => {
		exec(`./bin/HandBrakeCLI -i '${input}' -Z '${preset}' -o '${os.tmpdir()}/${output}'`, (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			console.log(NODE_ENV === 'development' ? stdout : null);
			resolve();
		});
	});
}