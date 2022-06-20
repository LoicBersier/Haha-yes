import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import utils from '../../utils/videos.js';

export default {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download a video.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('url of the video you want to download.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('advanced')
				.setDescription('Choose the quality of the video.')
				.setRequired(false)),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });
		const url = interaction.options.getString('url');

		if (!await utils.stringIsAValidurl(url)) {
			console.error(`Not a url!!! ${url}`);
			return interaction.editReply({ content: '❌ This does not look like a valid url!', ephemeral: true });
		}

		if (interaction.options.getBoolean('advanced')) {
			let qualitys = await new Promise((resolve, reject) => {
				exec(`./bin/yt-dlp ${url} --print "%()j"`, (err, stdout, stderr) => {
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
				options.push({
					label: f.resolution,
					description: `${f.format} V: ${f.vcodec} A: ${f.acodec}`,
					value: f.format_id,
				});
			});

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

			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('downloadQuality')
						.setPlaceholder('Nothing selected')
						.setMinValues(1)
						.setMaxValues(2)
						.addOptions(options),
				);

			await interaction.deleteReply();
			await interaction.followUp({ content: 'Which quality do you want?', ephemeral: true, components: [row] });

			interaction.client.once('interactionCreate', async (interactionMenu) => {
				if (!interactionMenu.isSelectMenu()) return;
				if (interactionMenu.customId === 'downloadQuality') {
					await interactionMenu.deferReply({ ephemeral: false });
					download(url, interactionMenu);
				}
			});
			return;
		}
		download(url, interaction);
	},
};

async function download(url, interaction) {
	let format = 'bestvideo*+bestaudio/best';
	const Embed = new MessageEmbed()
		.setColor(interaction.member ? interaction.member.displayHexColor : 'NAVY')
		.setAuthor({ name: `Downloaded by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL(), url: url })
		.setFooter({ text: `You can get the original video by clicking on the "Downloaded by ${interaction.user.tag}" message!` });

	if (interaction.customId === 'downloadQuality') {
		format = interaction.values[0];
		if (interaction.values[1]) format += '+' + interaction.values[1];
	}

	utils.downloadVideo(url, interaction.id, format)
		.then(async () => {
			const file = fs.readdirSync(os.tmpdir()).filter(fn => fn.startsWith(interaction.id));
			const output = `${os.tmpdir()}/${file}`;

			const fileStat = fs.statSync(output);
			const fileSize = fileStat.size / 1000000.0;

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
		})
		.catch(async err => {
			console.error(err);
			await interaction.deleteReply();
			await interaction.followUp({ content: 'Uh oh! An error has occured!', ephemeral: true });
		});
	return;
}
