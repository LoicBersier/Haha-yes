import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import os from 'node:os';
import YTPGenerator from 'ytpplus-node';

export default {
	data: new SlashCommandBuilder()
		.setName('ytp')
		.setDescription('Generate a YTP')
		.addBooleanOption(option =>
			option.setName('force')
				.setDescription('Force the generation of the video in non-nsfw channel.')
				.setRequired(false)),
	category: 'fun',
	async execute(interaction, args) {
		if (!interaction.channel.nsfw && !args.force) return interaction.reply(`Please execute this command in an NSFW channel ( Content might not be NSFW but since the video are user submitted better safe than sorry ) OR do \`\`${interaction.prefix}ytp --force\`\` to make the command work outside of nsfw channel BE AWARE THAT IT WON'T CHANGE THE FINAL RESULT SO NSFW CAN STILL HAPPEN`);

		// Read userVid folder and select random vid and only take .mp4
		const mp4 = [];
		const asset = [];
		// Count number of total vid
		fs.readdirSync('./asset/ytp/userVid/').forEach(file => {
			if (file.endsWith('mp4')) {
				mp4.push(file);
			}
		});
		const MAX_CLIPS = 20;
		// Select random vid depending on the amount of MAX_CLIPS
		for (let i = 0; i < MAX_CLIPS; i++) {
			const random = Math.floor(Math.random() * mp4.length);
			const vid = `./asset/ytp/userVid/${mp4[random]}`;
			if (mp4[random].endsWith('mp4')) {
				if (!asset.includes(vid)) {
					asset.push(vid);
				}
			}
		}

		const loadingmsg = await interaction.reply(`Processing, this can take a ***long*** time, i'll ping you when I finished <a:loadingmin:527579785212329984>\nSome info: There are currently ${mp4.length} videos, why not add yours? You can do so with the \`\`addytp\`\` command.\nLike ytp? Why not check out https://ytp.namejeff.xyz/`);

		const options = {
			debug: false,
			MAX_STREAM_DURATION: Math.floor((Math.random() * 3) + 1),
			sources: './asset/ytp/sources/',
			sounds: './asset/ytp/sounds/',
			music: './asset/ytp/music/',
			resources: './asset/ytp/resources/',
			temp: os.tmpdir(),
			sourceList: asset,
			intro: args.force ? './asset/ytp/intro.mp4' : null,
			outro: './asset/ytp/outro.mp4',
			OUTPUT_FILE: `${os.tmpdir()}/${interaction.id}_YTP.mp4`,
			MAX_CLIPS: MAX_CLIPS,
			transitions: true,
			showFileNames: true,
			effects: {
				effect_RandomSound: true,
				effect_RandomSoundMute: true,
				effect_Reverse: true,
				effect_Chorus: true,
				effect_Vibrato: true,
				effect_HighPitch: true,
				effect_LowPitch: true,
				effect_SpeedUp: true,
				effect_SlowDown: true,
				effect_Dance: true,
				effect_Squidward: true,
				effect_How: true,
			},
		};

		new YTPGenerator().configurateAndGo(options)
			.then(() => {
				loadingmsg.delete();
				return interaction.reply({ content: 'Here is your YTP! Remember, it might contain nsfw, so be careful!', files: [`${os.tmpdir()}/${interaction.id}_YTP.mp4`] })
					.catch(err => {
						console.error(err);
						return interaction.reply({ files: [`./asset/ytp/error${Math.floor(Math.random() * 2) + 1}.mp4`] });
					});
			})
			.catch(err => {
				console.error(err);
				loadingmsg.delete();
				return interaction.reply({ files: [`./asset/ytp/error${Math.floor(Math.random() * 2) + 1}.mp4`] });
			});
	},
};
