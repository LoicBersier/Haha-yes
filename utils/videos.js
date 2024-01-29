import os from 'node:os';
import { exec } from 'node:child_process';
const { NODE_ENV } = process.env;
const ytdlpMaxResolution = 2160;

export default {
	downloadVideo,
	upload,
	ffmpeg,
	stringIsAValidurl,
	compressVideo,
	getVideoCodec,
	getVideoSize,
	getMaxFileSize,
};
async function downloadVideo(urlArg, output, format = `bestvideo[height<=?${ytdlpMaxResolution}]+bestaudio/best`) {
	await new Promise((resolve, reject) => {
		exec(`./bin/yt-dlp -f "${format}" "${urlArg}" -o "${os.tmpdir()}/${output}.%(ext)s" --force-overwrites --no-playlist --remux-video=mp4/webm/mov --no-warnings`, (err, stdout, stderr) => {
			if (err) {
				return reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
				// Should already be rejected at that points
				return reject(stderr);
			}
			console.log(NODE_ENV === 'development' ? stdout : null);
			return resolve();
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
		exec(`./bin/HandBrakeCLI -i "${input}" -Z "${preset}" -o "${os.tmpdir()}/${output}"`, (err, stdout, stderr) => {
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
		exec(`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "${input}"`, (err, stdout, stderr) => {
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

async function getVideoSize(urlArg, format = `bestvideo[height<=?${ytdlpMaxResolution}]+bestaudio/best`) {
	return await new Promise((resolve, reject) => {
		exec(`./bin/yt-dlp "${urlArg}" -f "${format}" --no-warnings -O "%(filesize,filesize_approx)s"`, (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			resolve(stdout / 1000000.0);
		});
	});
}

async function getMaxFileSize(guild) {
	return await new Promise((resolve) => {
		const tier = guild.premiumTier;
		switch (tier) {
		case 0:
		case 1:
			resolve(25);
			break;
		case 2:
			resolve(50);
			break;
		case 3:
			resolve(100);
			break;
		default:
			resolve(25);
			break;
		}
	});
}