import { SlashCommandBuilder } from 'discord.js';
import utils from '../../utils/videos.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
const { NODE_ENV } = process.env;


export default {
	data: new SlashCommandBuilder()
		.setName('vid2gif')
		.setDescription('Convert your video into a gif.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('URL of the video you want to convert')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('quality')
				.setDescription('Quality of the gif conversion. Default 70. Number between 1 and 100')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('noloop')
				.setDescription('Stop the gif from looping')
				.setRequired(false)),
	category: 'utility',
	alias: ['v2g'],
	async execute(interaction, args) {
		await interaction.deferReply({ ephemeral: false });
		const maxFileSize = await utils.getMaxFileSize(interaction.guild);
		const url = args.url;
		let quality = args.quality;
		if (quality <= 0) {
			quality = 1;
		}
		else if (quality > 100) {
			quality = 100;
		}

		if (!await utils.stringIsAValidurl(url)) {
			console.error(`Not a url!!! ${url}`);
			return interaction.editReply({ content: '❌ This does not look like a valid url!', ephemeral: true });
		}

		utils.downloadVideo(url, interaction.id)
			.then(async () => {
				const file = fs.readdirSync(os.tmpdir()).filter(fn => fn.startsWith(interaction.id));
				const output = `${os.tmpdir()}/${file}`;
				const gifskiOutput = output.replace(path.extname(output), '.gif');
				const gifsicleOutput = output.replace(path.extname(output), 'gifsicle.gif');

				// Extract every frame for gifski
				await utils.ffmpeg(['-i', output, `${os.tmpdir()}/frame${interaction.id}%04d.png`]);
				// Make it look better
				await gifski(gifskiOutput, `${os.tmpdir()}/frame${interaction.id}*`, quality);
				// Optimize it
				await gifsicle(gifskiOutput, gifsicleOutput, args.noloop);

				const fileStat = fs.statSync(gifsicleOutput);
				const fileSize = fileStat.size / 1000000.0;

				if (fileSize > 100) {
					await interaction.deleteReply();
					await interaction.followUp('❌ Uh oh! The video once converted is too big!', { ephemeral: true });
				}
				else if (fileSize > maxFileSize) {
					const fileURL = await utils.upload(gifsicleOutput)
						.catch(err => {
							console.error(err);
						});
					await interaction.editReply({ content: `ℹ️ File was bigger than ${maxFileSize} mb. It has been uploaded to an external site.\n${fileURL}`, ephemeral: false });
				}
				else {
					await interaction.editReply({ files: [gifsicleOutput], ephemeral: false });
				}
			});
	},
};

async function gifski(output, input, quality) {
	return await new Promise((resolve, reject) => {
		// Shell: true should be fine as no user input is being passed
		execFile('gifski', ['--quality', quality ? quality : 70, '-o', output, input], { shell: true }, (err, stdout, stderr) => {
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

async function gifsicle(input, output, loop = false) {
	return await new Promise((resolve, reject) => {
		// Shell: true should be fine as no user input is being passed
		execFile('gifsicle', ['--colors', '256', loop ? '--no-loopcount' : '', '-i', input, '-o', output], { shell: true }, (err, stdout, stderr) => {
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
