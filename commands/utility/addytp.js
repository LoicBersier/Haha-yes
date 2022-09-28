import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import utils from '../../utils/videos.js';
import fs from 'node:fs';
import os from 'node:os';

const { ytpChannelId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('addytp')
		.setDescription('Add a video to the pool of ytps')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('URL of the video you want to add.')
				.setRequired(true)),
	category: 'utility',
	async execute(interaction, args) {
		const url = args.url;
		if (!await utils.stringIsAValidurl(url)) {
			console.error(`Not a url!!! ${url}`);
			return interaction.reply({ content: '❌ This does not look like a valid url!', ephemeral: true });
		}

		await interaction.deferReply({ ephemeral: true });

		utils.downloadVideo(url, interaction.id, 'mp4')
			.then(async () => {
				const file = fs.readdirSync(os.tmpdir()).filter(fn => fn.startsWith(interaction.id));
				const output = `${os.tmpdir()}/${file}`;

				const fileStat = fs.statSync(output);
				const fileSize = fileStat.size / 1000000.0;

				if (fileSize > 50) {
					// await interaction.deleteReply();
					await interaction.editReply({ content: '❌ Uh oh! The video is too big!', ephemeral: true });
				}
				else {
					// CopyFile instead of rename in case you have /tmp and the asset folder on different a disk.
					fs.copyFileSync(output, `./asset/ytp/userVid/${file}`);
					const mp4 = [];
					fs.readdirSync('./asset/ytp/userVid/').forEach(f => {
						if (f.endsWith('mp4')) {
							mp4.push(f);
						}
					});

					// (Hopefully) limit video to 2k
					if (mp4.length > 2000) {
						const f = mp4.sort((a, b) => {
							const time1 = fs.statSync(`./asset/ytp/userVid/${b}`).ctime;
							const time2 = fs.statSync(`./asset/ytp/userVid/${a}`).ctime;
							if (time1 < time2) return 1;
							if (time1 > time2) return -1;
							return 0;
						}).slice(0, 1);
						fs.unlinkSync(`./asset/ytp/userVid/${f[0]}`);
					}

					interaction.editReply({ content: `Video successfully added to the pool! There is now ${mp4.length} videos`, ephemeral: true });

					const Embed = new EmbedBuilder()
						.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
						.addFields([
							{ name: 'Channel ID', value: interaction.channel.id.toString(), inline: true },
							{ name: 'Message ID', value: interaction.id.toString(), inline: true },
							{ name: 'Author', value: `${interaction.user.username} (${interaction.user.id})`, inline: true },
						])
						.setTimestamp();

					if (interaction.guild) {
						Embed.addFields([
							{ name: 'Guild', value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true },
							{ name: 'Message link', value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}` },
						]);
					}
					else {
						Embed.addFields([
							{ name: 'Message link', value: `https://discord.com/channels/@me/${interaction.channel.id}/${interaction.id}` },
						]);
					}

					const channel = interaction.client.channels.resolve(ytpChannelId);
					// Send as 2 separate message otherwise the url won't get embedded.
					channel.send({ content: url });
					return channel.send({ embeds: [Embed] });


				}
			});
	},
};
