/* TODO
 *
 * Merge with commands/fun/image2audio.js
 *
*/
import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import os from 'node:os';
import fetch from 'node-fetch';
import util from 'node:util';
import stream from 'node:stream';
import utils from '../../utils/videos.js';

export default {
	data: new SlashCommandBuilder()
		.setName('audio2image')
		.setDescription('Transform an audio file into an image.')
		.addAttachmentOption(option =>
			option.setName('audio')
				.setDescription('The audio that will become image.')
				.setRequired(true)),
	category: 'fun',
	alias: ['a2i'],
	async execute(interaction, args) {
		if (!args.audio) return interaction.reply('Please attach an image with your message.');

		await interaction.deferReply();

		ifExistDelete(`${os.tmpdir()}/${args.audio.name}`);
		ifExistDelete(`${os.tmpdir()}/${args.audio.name}.png`);
		ifExistDelete(`${os.tmpdir()}/${args.audio.name}.sw`);
		ifExistDelete(`${os.tmpdir()}/${args.audio.name}.mp3`);

		const streamPipeline = util.promisify(stream.pipeline);
		const res = await fetch(args.audio.url);
		if (!res.ok) return interaction.editReply('An error has occured while trying to download your image.');
		await streamPipeline(res.body, fs.createWriteStream(`${os.tmpdir()}/${args.audio.name}`));

		await utils.ffmpeg(['-i', `${os.tmpdir()}/${args.audio.name}`, '-sample_rate', '44100', '-ac', '1', '-f', 's16le', '-acodec', 'pcm_s16le', `${os.tmpdir()}/${args.audio.name}.sw`]);
		await utils.ffmpeg(['-pixel_format', 'rgb24', '-video_size', '128x128', '-f', 'rawvideo', '-i', `${os.tmpdir()}/${args.audio.name}.sw`, '-frames:v', '1', `${os.tmpdir()}/${args.audio.name}.png`]);

		const file = fs.statSync(`${os.tmpdir()}/${args.audio.name}.png`);
		const fileSize = (file.size / 1000000.0).toFixed(2);

		if (fileSize > await utils.getMaxFileSize(interaction.guild)) return interaction.editReply('error');
		interaction.editReply({ content: `Image file is ${fileSize} MB` });
		return interaction.followUp({ files: [`${os.tmpdir()}/${args.audio.name}.png`] });
	},
};

async function ifExistDelete(path) {
	if (fs.existsSync(path)) {
		fs.rm(path, (err) => {
			console.log('deleted');
			if (err) {
				return;
			}
		});
	}
}