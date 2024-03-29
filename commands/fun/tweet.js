import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { TwitterApi } from 'twitter-api-v2';
import fetch from 'node-fetch';
import os from 'node:os';
import fs from 'node:fs';
import util from 'node:util';
import stream from 'node:stream';

import db from '../../models/index.js';
import wordToCensor from '../../json/censor.json' assert {type: 'json'};
const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret, twiChannel, twiLogChannel } = process.env;

const Blacklists = db.Blacklists;

export default {
	data: new SlashCommandBuilder()
		.setName('tweet')
		.setDescription('Send tweet from the bot twitter account. Please do not use it for advertisement and keep it english')
		.addStringOption(option =>
			option.setName('content')
				.setDescription('!THIS IS NOT FEEDBACK! The content of the tweet you want to send me.')
				.setRequired(false))
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Optional attachment (Image only.)')
				.setRequired(false)),
	category: 'fun',
	ratelimit: 3,
	cooldown: 86400,
	guildOnly: true,
	async execute(interaction, args, client) {
		const content = args.content;
		const attachment = args.image;

		if (!content && !attachment) {
			return interaction.reply({ content: 'Uh oh! You are missing any content for me to tweet!', ephemeral: true });
		}

		await interaction.deferReply({ ephemeral: false });
		let tweet = content;
		const date = new Date();

		// If guild is less than 1 month old don't accept the tweet
		if (interaction.guild.createdAt > date.setMonth(date.getMonth() - 1)) {
			await interaction.editReply({ content: 'The server need to be 1 month old to be able to use this command!' });
			return;
		}

		// Reset the date for the next check
		date.setTime(Date.now());

		// If the bot has been in the guild for less than 1 week don't accept the tweet.
		if (interaction.guild.createdAt > date.setDate(date.getDate() - 7)) {
			await interaction.editReply({ content: 'I need to be in this server for a week to be able to use this command!' });
		}

		// Reset the date for the next check
		date.setTime(Date.now());

		// If account is less than 6 months old don't accept the tweet ( alt prevention )
		if (interaction.user.createdAt > date.setMonth(date.getMonth() - 6)) {
			await interaction.editReply({ content: 'Your account is too new to be able to use this command!' });
			return;
		}

		// Reset the date for the next check
		date.setTime(Date.now());

		// If account is less than 1 year old don't accept attachment
		if (attachment && interaction.user.createdAt > date.setFullYear(date.getFullYear() - 1)) {
			await interaction.editReply({ content: 'Your account need to be 1 year or older to be able to send attachment!' });
			return;
		}

		if (tweet) {
			// remove zero width space
			tweet = tweet.replace('​', '');
			// This should only happen if someone tweets a zero width space
			if (tweet.length === 0) {
				return interaction.reply({ content: 'Uh oh! You are missing any content for me to tweet!', ephemeral: true });
			}

			wordToCensor.forEach(async word => {
				if (tweet.toLowerCase().includes(word.toLowerCase())) {
					const body = { type:'tweet', uid: interaction.user.id, reason: 'Automatic ban from banned word.' };
					Blacklists.create(body);

					await interaction.editReply({ content: 'Sike, you just posted cringe! Enjoy the blacklist :)' });
					return;
				}
			});
			// Detect banned word (Blacklist the user directly)
			/* No worky (I don't remember what the fuck I wrote here)
			if (wordToCensor.includes(tweet) || wordToCensor.includes(tweet.substring(0, tweet.length - 1)) || wordToCensor.includes(tweet.substring(1, tweet.length))) {
				const body = { type:'tweet', uid: interaction.user.id, reason: 'Automatic ban from banned word.' };
				Blacklists.create(body);

				await interaction.editReply({ content: 'Sike, you just posted cringe! Enjoy the blacklist :)' });
				return;
			}
			*/

			// Very simple link detection
			if (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(tweet) && !tweet.includes('twitter.com')) {
				await interaction.editReply({ content: 'You may not tweet links outside of twitter.com' });
				return;
			}
			// Do not allow discord invites
			if (tweet.includes('discord.gg') || tweet.includes('discord.com/invite/')) {
				await interaction.editReply({ content: 'No discord invite allowed.' });
				return;
			}
		}


		const userClient = new TwitterApi({
			appKey: twiConsumer,
			appSecret: twiConsumerSecret,
			accessToken: twiToken,
			accessSecret: twiTokenSecret,
		});

		try {
			// Make sure there is an attachment and if its an image
			if (attachment) {
				if (attachment.name.toLowerCase().endsWith('.jpg') || attachment.name.toLowerCase().endsWith('.png') || attachment.name.toLowerCase().endsWith('.gif')) {
					const streamPipeline = util.promisify(stream.pipeline);
					const res = await fetch(attachment.url);
					if (!res.ok) return interaction.editReply('An error has occured while trying to download your image.');
					await streamPipeline(res.body, fs.createWriteStream(`${os.tmpdir()}/${attachment.name}`));

					const file = fs.statSync(`${os.tmpdir()}/${attachment.name}`);
					const fileSize = file.size / 1000000.0;

					if ((attachment.name.toLowerCase().endsWith('.jpg') || attachment.name.toLowerCase().endsWith('.png')) && fileSize > 5) {
						return interaction.editReply({ content: 'Images can\'t be larger than 5 MB!' });
					}
					else if (attachment.name.toLowerCase().endsWith('.gif') && fileSize > 15) {
						return interaction.editReply({ content: 'Gifs can\'t be larger than 15 MB!' });
					}

					const image = await userClient.v1.uploadMedia(`${os.tmpdir()}/${attachment.name}`);
					Tweet(image);
				}
				else {
					await interaction.editReply({ content: 'File type not supported, you can only send jpg/png/gif' });
					return;
				}
			}
			else {
				Tweet();
			}
		}
		catch (err) {
			console.error(err);
			await interaction.editReply({ content: 'Oh no, an error has occurred :(' });
			return;
		}

		async function Tweet(img) {
			let options = null;
			if (img) {
				options = { media: { media_ids: new Array(img) } };
			}
			const tweeted = await userClient.v2.tweet(tweet, options);

			const tweetid = tweeted.data.id;
			const FunnyWords = ['oppaGangnamStyle', '69', '420', 'cum', 'funnyMan', 'GUCCISmartToilet', 'TwitterForClowns', 'fart', 'ok', 'hi', 'howAreYou', 'WhatsNinePlusTen', '21'];
			const TweetLink = `https://vxtwitter.com/${FunnyWords[Math.floor((Math.random() * FunnyWords.length))]}/status/${tweetid}`;

			let channel = await client.channels.resolve(twiChannel);
			channel.send(TweetLink);

			const Embed = new EmbedBuilder()
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
				.setDescription(tweet ? tweet : 'No content.')
				.addFields(
					{ name: 'Link', value: TweetLink, inline: true },
					{ name: 'Tweet ID', value: tweetid, inline: true },
					{ name: 'Channel ID', value: interaction.channel.id, inline: true },
					{ name: 'Message ID', value: interaction.id, inline: true },
					{ name: 'Author', value: `${interaction.user.username} (${interaction.user.id})`, inline: true },
				)
				.setTimestamp();

			if (interaction.guild) {
				Embed.addFields(
					{ name: 'Guild', value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true },
					{ name: 'message link', value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`, inline: true },
				);
			}
			else {
				Embed.addFields({ name: 'message link', value: `https://discord.com/channels/@me/${interaction.channel.id}/${interaction.id}` });
			}

			if (attachment) Embed.setImage(attachment.url);

			channel = await client.channels.resolve(twiLogChannel);
			channel.send({ embeds: [Embed] });
			return interaction.editReply({ content: `Go see ur epic tweet ${TweetLink}` });
		}
	},
};
