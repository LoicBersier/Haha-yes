/* TODO
 *
 * Merge with commands/fun/audio2image.js
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
		.setName('image2audio')
		.setDescription('Transform an image binary data into audio ( MIGHT BE VERY LOUD )')
		.addAttachmentOption(option =>
			option.setName('img')
				.setDescription('The image that will become audio. Only tested with png and jpg.')
				.setRequired(true)),
	category: 'fun',
	async execute(interaction, args) {
		if (!args.img) return interaction.reply('Please attach an image with your message.');

		await interaction.deferReply();

		ifExistDelete(`${os.tmpdir()}/${args.img.name}`);
		ifExistDelete(`${os.tmpdir()}/1${args.img.name}`);
		ifExistDelete(`${os.tmpdir()}/${args.img.name}.mp3`);

		const streamPipeline = util.promisify(stream.pipeline);
		const res = await fetch(args.img.url);
		if (!res.ok) return interaction.editReply('An error has occured while trying to download your image.');
		await streamPipeline(res.body, fs.createWriteStream(`${os.tmpdir()}/${args.img.name}`));

		await utils.ffmpeg(`-i ${os.tmpdir()}/${args.img.name} -f rawvideo ${os.tmpdir()}/1${args.img.name}`);
		await utils.ffmpeg(`-sample_rate 44100 -ac 1 -f s16le -i ${os.tmpdir()}/1${args.img.name} ${os.tmpdir()}/${args.img.name}.mp3`);

		const file = fs.statSync(`${os.tmpdir()}/${args.img.name}.mp3`);
		const fileSize = (file.size / 1000000.0).toFixed(2);

		if (fileSize > utils.getMaxFileSize(interaction.guild)) return interaction.editReply('error');
		interaction.editReply({ content: `Audio file is ${fileSize} MB` });
		return interaction.followUp({ files: [`${os.tmpdir()}/${args.img.name}.mp3`] });
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