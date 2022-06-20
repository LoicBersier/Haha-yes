import { SlashCommandBuilder } from '@discordjs/builders';
import utils from '../../utils/videos.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exec } from 'node:child_process';


export default {
	data: new SlashCommandBuilder()
		.setName('vid2gif')
		.setDescription('Convert your video into a gif.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('URL of the video you want to convert')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });
		const url = interaction.options.getString('url');

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
				await utils.ffmpeg(`-i ${output} ${os.tmpdir()}/frame${interaction.id}%04d.png`);
				// Make it look better
				await gifski(gifskiOutput, `${os.tmpdir()}/frame${interaction.id}*`);
				// Optimize it
				await gifsicle(gifskiOutput, gifsicleOutput);

				const fileStat = fs.statSync(gifsicleOutput);
				const fileSize = fileStat.size / 1000000.0;

				if (fileSize > 100) {
					await interaction.deleteReply();
					await interaction.followUp('Uh oh! The video once converted is too big!', { ephemeral: true });
				}
				else if (fileSize > 8) {
					const fileURL = await utils.upload(gifsicleOutput)
						.catch(err => {
							console.error(err);
						});
					await interaction.editReply({ content: `File was bigger than 8 mb. It has been uploaded to an external site.\n${fileURL}`, ephemeral: false });
				}
				else {
					await interaction.editReply({ files: [gifsicleOutput], ephemeral: false });
				}
			});
	},
};

async function gifski(output, input) {
	return await new Promise((resolve, reject) => {
		exec(`gifski --quality 70 -o ${output} ${input}`, (err, stdout, stderr) => {
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

async function gifsicle(input, output) {
	return await new Promise((resolve, reject) => {
		exec(`gifsicle --colors 256 -i ${input} -o ${output}`, (err, stdout, stderr) => {
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
