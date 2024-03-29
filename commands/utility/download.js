import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import utils from '../../utils/videos.js';

let client;
let maxFileSize;

let { ytdlpMaxResolution } = process.env;
// Convert to number as process.env is always a string
ytdlpMaxResolution = Number(ytdlpMaxResolution);

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
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('description')
				.setDescription('Include the video description?')
				.setRequired(false)),
	category: 'utility',
	alias: ['dl'],

	async execute(interaction, args, c) {
		client = c;
		const url = args.url;
		const format = args.format;
		maxFileSize = await utils.getMaxFileSize(interaction.guild);
		interaction.doCompress = args.compress;

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
				execFile('./bin/yt-dlp', [url, '--print', '%()j'], (err, stdout, stderr) => {
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
					new StringSelectMenuBuilder()
						.setCustomId(`downloadQuality${interaction.user.id}${interaction.id}`)
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
				if (interactionMenu.customId === `downloadQuality${interaction.user.id}${interaction.id}`) {
					await interactionMenu.deferReply({ ephemeral: false });

					await checkSize(url, interactionMenu.values[0], args, interaction);
					return download(url, interactionMenu, interaction, undefined, true);
				}
			});
			return;
		}
		const newFormat = await checkSize(url, undefined, args, interaction);
		return download(url, interaction, interaction, newFormat, args.description);
	},
};

async function download(url, interaction, originalInteraction, format = undefined, description = false) {
	const Embed = new EmbedBuilder()
		.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
		.setAuthor({ name: `Downloaded by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL(), url: url })
		.setFooter({ text: `You can get the original video by clicking on the "Downloaded by ${interaction.user.username}" message!` });

	if (description) {
		Embed.setDescription(await getVideoDescription(url));
	}

	if (interaction.customId === `downloadQuality${interaction.user.id}${originalInteraction.id}` && !format) {
		format = interaction.values[0];
		if (interaction.values[1]) format += '+' + interaction.values[1];
	}

	utils.downloadVideo(url, interaction.id, format)
		.then(async () => {
			const file = fs.readdirSync(os.tmpdir()).filter(fn => fn.startsWith(interaction.id));
			let output = `${os.tmpdir()}/${file}`;

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
						new StringSelectMenuBuilder()
							.setCustomId(`preset${interaction.user.id}${interaction.id}`)
							.setPlaceholder('Nothing selected')
							.addOptions(options),
					);

				await interaction.deleteReply();
				await interaction.followUp({ content: 'Which compression preset do you want?', ephemeral: true, components: [row] });
				client.on('interactionCreate', async (interactionMenu) => {
					if (interaction.user !== interactionMenu.user) return;
					if (!interactionMenu.isSelectMenu()) return;
					if (interactionMenu.customId === `preset${interaction.user.id}${interaction.id}`) {
						await interactionMenu.deferReply({ ephemeral: false });
						compress(file, interactionMenu, Embed);
						if (interaction.isMessage) {
							interaction.deleteReply();
							interaction.cleanUp();
						}
					}
				});
				return;
			}

			// If the video format is not one compatible with Discord, reencode it.
			const bannedFormats = ['hevc'];
			const codec = await utils.getVideoCodec(output);

			if (bannedFormats.includes(codec)) {
				const oldOutput = output;
				output = `${os.tmpdir()}/264${file}`;
				await utils.ffmpeg(['-i', oldOutput, '-vcodec', 'libx264', '-acodec', 'aac', output]);
			}

			const fileStat = fs.statSync(output);
			const fileSize = fileStat.size / 1000000.0;

			Embed.setAuthor({ name: `${Embed.data.author.name} (${fileSize.toFixed(2)} MB)`, iconURL: Embed.data.author.icon_url, url: Embed.data.author.url });

			let message = null;
			if (interaction.isMessage && interaction.reference !== null) {
				const channel = client.channels.resolve(interaction.reference.channelId);
				message = await channel.messages.fetch(interaction.reference.messageId);
			}

			if (fileSize > 100) {
				await interaction.deleteReply();
				await interaction.followUp('Uh oh! The video you tried to download is too big!', { ephemeral: true });
			}
			else if (fileSize > maxFileSize) {
				const fileurl = await utils.upload(output)
					.catch(err => {
						console.error(err);
					});

				await interaction.editReply({ content: `File was bigger than ${maxFileSize} mb. It has been uploaded to an external site.`, embeds: [Embed], ephemeral: false });
				if (interaction.isMessage && message) {
					await message.reply({ content: fileurl });
				}
				else {
					await interaction.followUp({ content: fileurl, ephemeral: false });
				}
			}
			else if (interaction.isMessage && message) {
				await message.reply({ embeds: [Embed], files: [output] });
			}
			else {
				await interaction.editReply({ embeds: [Embed], files: [output], ephemeral: false });
			}

			if (interaction.isMessage) {
				interaction.deleteReply();
				interaction.cleanUp();
			}
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
	if (fs.existsSync(output)) {
		fs.rmSync(output);
	}

	utils.compressVideo(`${os.tmpdir()}/${input}`, output, interaction.values[0])
		.then(async () => {
			const fileStat = fs.statSync(`${os.tmpdir()}/${output}`);
			const fileSize = fileStat.size / 1000000.0;

			embed.setAuthor({ name: `${embed.data.author.name} (${fileSize.toFixed(2)} MB)`, iconURL: embed.data.author.icon_url, url: embed.data.author.url });

			if (fileSize > maxFileSize) {
				await interaction.editReply({ content: `File was bigger than ${maxFileSize} mb. It has been uploaded to an external site.`, ephemeral: false });
			}
			else {
				await interaction.editReply({ embeds: [embed], files: [`${os.tmpdir()}/${output}`], ephemeral: false });
			}
		});
}

async function checkSize(url, format, args, interaction, tries = 0) {
	const resolutions = [144, 240, 360, 480, 720, 1080, 1440, 2160];

	while (tries < 4) {
		format = `bestvideo[height<=?${resolutions[resolutions.indexOf(ytdlpMaxResolution) - tries]}]+bestaudio/best`;
		const aproxFileSize = await utils.getVideoSize(url, format);
		if (isNaN(aproxFileSize)) return format;

		if (format || tries >= 4) {
			if (aproxFileSize > 100 && !args.compress && tries > 4) {
				return await interaction.followUp(`Uh oh! The video you tried to download is larger than 100 mb (is ${aproxFileSize} mb)! Try again with a lower resolution format.`);
			}
			else if (aproxFileSize > 500 && tries > 4) {
				return await interaction.followUp(`Uh oh! The video you tried to download is larger than 500 mb (is ${aproxFileSize} mb)! Try again with a lower resolution format.`);
			}
		}

		if (aproxFileSize < 100) {
			return format;
		}

		if (tries < 4 && aproxFileSize > 100) {
			tries++;
		}
	}
}

async function getVideoDescription(urlArg) {
	return await new Promise((resolve, reject) => {
		execFile('./bin/yt-dlp', [urlArg, '--no-warnings', '-O', '%(description)s'], (err, stdout, stderr) => {
			if (err) {
				reject(stderr);
			}
			if (stderr) {
				console.error(stderr);
			}
			resolve(stdout.slice(0, 240));
		});
	});
}