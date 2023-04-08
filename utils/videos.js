import os from 'node:os';
import { exec } from 'node:child_process';
const { NODE_ENV } = process.env;

export default {
	downloadVideo,
	upload,
	ffmpeg,
	stringIsAValidurl,
	compressVideo,
	getVideoCodec,
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
		exec(`ffmpeg -hide_banner ${command}`, (err, stdout, stderr) => {
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
async function getVideoCodec(input) {
	return await new Promise((resolve, reject) => {
		exec(`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 ${input}`, (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			resolve(stdout.trim());
		});
	});
}