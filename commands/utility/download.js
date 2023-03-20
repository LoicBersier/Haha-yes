import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } from 'discord.js';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import utils from '../../utils/videos.js';

let client;
let cleanUp;

export default {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download a video.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('url of the video you want to download.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('format')
				.setDescription('Choose the quality of the video.')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('compress')
				.setDescription('Compress the video?')
				.setRequired(false)),
	category: 'utility',
	alias: ['dl'],

	async execute(interaction, args, c) {
		client = c;
		const url = args.url;
		const format = args.format;
		interaction.doCompress = args.compress;
		if (interaction.cleanUp) {
			cleanUp = interaction.cleanUp;
		}

		await interaction.deferReply({ ephemeral: false });

		if (interaction.isMessage) {
			interaction.delete();
		}

		if (!await utils.stringIsAValidurl(url)) {
			console.error(`Not a url!!! ${url}`);
			return interaction.editReply({ content: '❌ This does not look like a valid url!', ephemeral: true });
		}

		if (format) {
			let qualitys = await new Promise((resolve, reject) => {
				exec(`./bin/yt-dlp "${url}" --print "%()j"`, (err, stdout, stderr) => {
					if (err) {
						reject(stderr);
					}
					if (stderr) {
						console.error(stderr);
					}
					resolve(stdout);
				});
			});
			qualitys = JSON.parse(qualitys);

			const options = [];

			qualitys.formats.forEach(f => {
				if (f.format.includes('storyboard')) return;
				options.push({
					label: f.resolution ? f.resolution : 'Unknown format',
					description: `${f.format} V: ${f.vcodec} A: ${f.acodec}`,
					value: f.format_id,
				});
			});

			if (options.length < 2) {
				await interaction.deleteReply();
				return interaction.followUp({ content: '❌ There is no other quality option for this video!', ephemeral: true });
			}

			if (options.length > 25) {
				// Reverse so the higher quality formats are first
				options.reverse();
				while (options.length > 25) {
					// Remove the lower quality formats
					options.pop();
				}
				// Reverse again so the lower quality appears first
				options.reverse();
			}

			const row = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId(`downloadQuality${interaction.user.id}`)
						.setPlaceholder('Nothing selected')
						.setMinValues(1)
						.setMaxValues(2)
						.addOptions(options),
				);

			await interaction.deleteReply();
			await interaction.followUp({ content: 'Which quality do you want?', ephemeral: true, components: [row] });

			client.on('interactionCreate', async (interactionMenu) => {
				if (interaction.user !== interactionMenu.user) return;
				if (!interactionMenu.isSelectMenu()) return;
				if (interactionMenu.customId === `downloadQuality${interaction.user.id}`) {
					await interactionMenu.deferReply({ ephemeral: false });
					download(url, interactionMenu, interaction);
				}
			});
			return;
		}
		download(url, interaction);
	},
};

async function download(url, interaction, originalInteraction) {
	let format = 'bestvideo*+bestaudio/best';
	const Embed = new EmbedBuilder()
		.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
		.setAuthor({ name: `Downloaded by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL(), url: url })
		.setFooter({ text: `You can get the original video by clicking on the "Downloaded by ${interaction.user.tag}" message!` });

	if (interaction.customId === `downloadQuality${interaction.user.id}`) {
		format = interaction.values[0];
		if (interaction.values[1]) format += '+' + interaction.values[1];
	}

	utils.downloadVideo(url, interaction.id, format)
		.then(async () => {
			const file = fs.readdirSync(os.tmpdir()).filter(fn => fn.startsWith(interaction.id));
			let output = `${os.tmpdir()}/${file}`;

			const fileStat = fs.statSync(output);
			const fileSize = fileStat.size / 1000000.0;
			const compressInteraction = originalInteraction ? originalInteraction : interaction;
			if (compressInteraction.doCompress) {
				const presets = [ 'Social 8 MB 3 Minutes 360p30', 'Social 50 MB 10 Minutes 480p30', 'Social 50 MB 5 Minutes 720p30', 'Social 100 MB 5 Minutes 1080p30' ];
				const options = [];

				presets.forEach(p => {
					options.push({
						label: p,
						value: p,
					});
				});

				const row = new ActionRowBuilder()
					.addComponents(
						new SelectMenuBuilder()
							.setCustomId(`preset${interaction.user.id}`)
							.setPlaceholder('Nothing selected')
							.addOptions(options),
					);

				await interaction.deleteReply();
				await interaction.followUp({ content: 'Which compression preset do you want?', ephemeral: true, components: [row] });
				client.on('interactionCreate', async (interactionMenu) => {
					if (interaction.user !== interactionMenu.user) return;
					if (!interactionMenu.isSelectMenu()) return;
					if (interactionMenu.customId === `preset${interaction.user.id}`) {
						await interactionMenu.deferReply({ ephemeral: false });
						compress(file, interactionMenu, Embed);
						if (interaction.isMessage) cleanUp();
					}
				});
				return;
			}

			// If the video format is not one compatible with Discord, reencode it.
			const bannedFormats = ['hevc'];
			const codec = await utils.getVideoCodec(output);

			if (bannedFormats.includes(codec)) {
				console.log('Reencoding video');
				const oldOutput = output;
				output = `${os.tmpdir()}/264${file}`;
				await utils.ffmpeg(`-i ${oldOutput} -vcodec libx264 -acodec aac ${output}`);
			}

			if (fileSize > 100) {
				await interaction.deleteReply();
				await interaction.followUp('Uh oh! The video you tried to download is too big!', { ephemeral: true });
			}
			else if (fileSize > 8) {
				const fileurl = await utils.upload(output)
					.catch(err => {
						console.error(err);
					});
				await interaction.editReply({ content: 'File was bigger than 8 mb. It has been uploaded to an external site.', embeds: [Embed], ephemeral: false });
				await interaction.followUp({ content: fileurl, ephemeral: false });
			}
			else {
				await interaction.editReply({ embeds: [Embed], files: [output], ephemeral: false });
			}
			if (interaction.isMessage) cleanUp();
		})
		.catch(async err => {
			console.error(err);
			await interaction.deleteReply();
			await interaction.followUp({ content: 'Uh oh! An error has occured!', ephemeral: true });
		});
	return;
}

async function compress(input, interaction, embed) {
	const output = `compressed${input}.mp4`;
	// Delete the file as it apparently don't overwrite?
	fs.rmSync(output);
	utils.compressVideo(`${os.tmpdir()}/${input}`, output, interaction.values[0])
		.then(async () => {
			const fileStat = fs.statSync(`${os.tmpdir()}/${output}`);
			const fileSize = fileStat.size / 1000000.0;

			if (fileSize > 8) {
				await interaction.editReply({ content: 'File was bigger than 8 mb. but due to the compression it is not being uploaded externally.', ephemeral: true });
			}
			else {
				await interaction.editReply({ embeds: [embed], files: [`${os.tmpdir()}/${output}`], ephemeral: false });
			}
		});
}