/* TODO
 *
 * To be merged with commands/AI/txt2img.js
 *
*/
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';
import os from 'node:os';
import fs from 'node:fs';
import stream from 'node:stream';
import util from 'node:util';

import db from '../../models/index.js';

const { stableHordeApi, stableHordeID } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('img2img')
		.setDescription('AI generated image with stable diffusion (If credit are low it may be slow)')
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Image you want to modify')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('What do you want the AI to generate?')
				.setRequired(true)),
	category: 'AI',
	alias: ['i2i'],
	async execute(interaction, args, client) {
		await interaction.deferReply();

		const streamPipeline = util.promisify(stream.pipeline);
		const res = await fetch(args.image.url);
		if (!res.ok) return interaction.editReply('An error has occured while trying to download your image.');
		await streamPipeline(res.body, fs.createWriteStream(`${os.tmpdir()}/${args.image.name}.webp`));

		const b64Image = fs.readFileSync(`${os.tmpdir()}/${args.image.name}.webp`, { encoding: 'base64' });
		generate(interaction, args.prompt, client, b64Image);
	},
};

async function generate(i, prompt, client, b64Img) {
	console.log('Generating image');
	const body = {
		prompt: prompt,
		params: {
			n: 1,
			width: 512,
			height: 512,
		},
		cfg_scale: 9,
		use_gfpgan: true,
		use_real_esrgan: true,
		use_ldsr: true,
		use_upscaling: true,
		steps: 50,
		nsfw: i.channel.nsfw ? true : false,
		censor_nsfw: i.channel.nsfw ? true : false,
		source_image: b64Img,
		source_processing: 'img2img',
		shared: true,
	};

	const isOptOut = await db.optout.findOne({ where: { userID: i.user.id } });

	if (isOptOut) {
		body.shared = false;
	}

	const fetchParameters = {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json', 'apikey': stableHordeApi },
	};

	let response = await fetch('https://stablehorde.net/api/v2/generate/async', fetchParameters);

	response = await response.json();

	if (!response.id) {
		console.log(response);
		return i.editReply({ content: `An error has occured, please try again later. \`${response.message}\`` });
	}

	let wait_time = 5000;
	let checkURL = `https://stablehorde.net/api/v2/generate/check/${response.id}`;
	const checking = setInterval(async () => {
		const checkResult = await checkGeneration(checkURL);

		if (checkResult === undefined) return;
		if (!checkResult.done) {
			if (checkResult.wait_time === -1) {
				console.log(checkResult.raw);
				return i.editReply({ content: `An error has occured, please try again later. \`${checkResult.raw.message}\`` });
			}

			if (checkResult.wait_time < 0) {
				console.log(checkResult.raw);
				clearInterval(checking);
				return i.editReply({ content: 'No servers are currently available to fulfill your request, please try again later.' });
			}
			if (checkResult.wait_time === 0) {
				checkURL = `https://stablehorde.net/api/v2/generate/status/${response.id}`;
			}
			wait_time = checkResult.wait_time;
		}
		else if (checkResult.done && checkResult.image) {
			clearInterval(checking);
			let creditResponse = await fetch(`https://stablehorde.net/api/v2/users/${stableHordeID}`);
			creditResponse = await creditResponse.json();

			const streamPipeline = util.promisify(stream.pipeline);
			const res = await fetch(checkResult.image);
			if (!res.ok) return i.editReply('An error has occured while trying to download your image.');
			await streamPipeline(res.body, fs.createWriteStream(`${os.tmpdir()}/${i.id}.webp`));

			const generatedImg = new AttachmentBuilder(`${os.tmpdir()}/${i.id}.webp`);

			const stableEmbed = new EmbedBuilder()
				.setColor(i.member ? i.member.displayHexColor : 'Navy')
				.setTitle(prompt)
				.setURL('https://aqualxx.github.io/stable-ui/')
				.setImage(`attachment://${i.id}.webp`)
				.setFooter({ text: `**Credit left: ${creditResponse.kudos}** Seed: ${checkResult.seed} worker ID: ${checkResult.worker_id} worker name: ${checkResult.worker_name}` });

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`regenerate${i.user.id}${i.id}`)
						.setLabel('🔄 Regenerate')
						.setStyle(ButtonStyle.Primary),
				);

			await i.editReply({ embeds: [stableEmbed], components: [row], files: [generatedImg] });

			listenButton(client, i, prompt);
		}
	}, wait_time);
}

async function checkGeneration(url) {
	let check = await fetch(url);
	check = await check.json();

	if (!check.is_possible) {
		return { done: false, wait_time: -1, raw: check };
	}

	if (check.done) {
		if (!check.generations) {
			return { done: false, wait_time: check.wait_time * 1000, raw: check };
		}

		return { done: true, image: check.generations[0].img, seed: check.generations[0].seed, worker_id: check.generations[0].worker_id, worker_name: check.generations[0].worker_name, raw: check };
	}
}

async function listenButton(client, interaction, prompt) {
	client.once('interactionCreate', async (interactionMenu) => {
		if (!interactionMenu.isButton()) return;

		await interactionMenu.update({ components: [] });

		if (interactionMenu.customId === `regenerate${interactionMenu.user.id}${interaction.id}`) {
			await interactionMenu.deferReply();
			await generate(interactionMenu, prompt, client);
		}
	});
}