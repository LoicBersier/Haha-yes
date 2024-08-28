import os from 'node:os';
import { execFile } from 'node:child_process';
const { NODE_ENV, ytdlpMaxResolution, proxy } = process.env;

export default {
	downloadVideo,
	upload,
	ffmpeg,
	stringIsAValidurl,
	compressVideo,
	getVideoCodec,
	getVideoSize,
	getMaxFileSize,
	autoCrop,
};
async function downloadVideo(urlArg, output, format = `bestvideo[height<=?${ytdlpMaxResolution}]+bestaudio/best`) {
	await new Promise((resolve, reject) => {
		const options = ['-f', format, urlArg, '-o', `${os.tmpdir()}/${output}.%(ext)s`, '--force-overwrites', '--no-playlist', '--remux-video=mp4/webm/mov', '--no-warnings'];
		if (proxy) {
			options.push('--proxy');
			options.push(proxy);
		};
		execFile('./bin/yt-dlp', options, (err, stdout, stderr) => {
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
		execFile('./bin/upload.sh', [file], (err, stdout, stderr) => {
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
		execFile('ffmpeg', ['-hide_banner', ...command], (err, stdout, stderr) => {
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
		execFile('./bin/HandBrakeCLI', ['-i', input, '-Z', preset, '--turbo', '--optimize', '-o', `${os.tmpdir()}/${output}`], (err, stdout, stderr) => {
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
		execFile('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name', '-of', 'default=noprint_wrappers=1:nokey=1', input], (err, stdout, stderr) => {
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
		const options = [urlArg, '-f', format, '--no-warnings', '-O', '%(filesize,filesize_approx)s'];
		if (proxy) {
			options.push('--proxy');
			options.push(proxy);
		};
		execFile('./bin/yt-dlp', options, (err, stdout, stderr) => {
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
		if (!guild) {
			resolve(25);
		}

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

async function autoCrop(input, output) {
	return await new Promise((resolve, reject) => {
		let ffprobeInput = input;
		if (process.platform === 'win32') {
			// ffprobe 'movie=' options does not like windows absolute path
			ffprobeInput = input.replace(/\\/g, '/').replace(/\:/g, '\\\\:');
		}

		execFile('ffprobe',
			['-f', 'lavfi', '-i', `movie=${ffprobeInput},cropdetect`, '-show_entries',
				'packet_tags=lavfi.cropdetect.w,lavfi.cropdetect.h,lavfi.cropdetect.x,lavfi.cropdetect.y',
				'-read_intervals', '%+#10', '-hide_banner', '-print_format', 'json'], async (err, stdout, stderr) => {
				if (err) {
					reject(stderr);
				}
				if (stderr) {
					console.error(stderr);
				}
				const packets = JSON.parse(stdout).packets;

				for (let i = 0; i < packets.length; i++) {
					const element = packets[i];

					if (element.tags) {
						const cropdetect = element.tags;
						await ffmpeg(['-i', input, '-vf', `crop=${cropdetect['lavfi.cropdetect.w']}:${cropdetect['lavfi.cropdetect.h']}:${cropdetect['lavfi.cropdetect.x']}:${cropdetect['lavfi.cropdetect.y']}`, '-vcodec', 'libx264', '-acodec', 'aac', output]);
						break;
					}
				}

				console.log(NODE_ENV === 'development' ? stdout : null);
				resolve();
			});
	});
}
