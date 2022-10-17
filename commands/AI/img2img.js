import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'node:fs';
import os from 'node:os';

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
	async execute(interaction, args, client) {
		await interaction.deferReply();
		fetch(args.image.url)
			.then((res) => {
				const dest = fs.createWriteStream(`${os.tmpdir()}/${args.image.name}`);
				res.body.pipe(dest);
				dest.on('finish', () => {
					const b64Image = fs.readFileSync(`${os.tmpdir()}/${args.image.name}`, { encoding: 'base64' });
					generate(interaction, args.prompt, b64Image, client);
				});
			});
	},
};

async function generate(i, prompt, b64Img) {
	const body = {
		prompt: prompt,
		params: {
			n: 1,
			width: 512,
			height: 512,
		},
		cfg_scale: 5,
		use_gfpgan: true,
		use_real_esrgan: true,
		use_ldsr: true,
		use_upscaling: true,
		steps: 50,
		nsfw: i.channel.nsfw ? true : false,
		censor_nsfw: i.channel.nsfw ? true : false,
		source_image: b64Img,
	};

	const fetchParameters = {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json', 'apikey': stableHordeApi },
	};

	let response = await fetch('https://stablehorde.net/api/v2/generate/sync', fetchParameters);

	response = await response.json();

	let creditResponse = await fetch(`https://stablehorde.net/api/v2/users/${stableHordeID}`);
	creditResponse = await creditResponse.json();

	const stableEmbed = new EmbedBuilder()
		.setColor(i.member ? i.member.displayHexColor : 'Navy')
		.setTitle(prompt)
		.setURL('https://aqualxx.github.io/stable-ui/')
		.setFooter({ text: `**Credit left: ${creditResponse.kudos}** Seed: ${response.generations[0].seed} worker ID: ${response.generations[0].worker_id} worker name: ${response.generations[0].worker_name}` });

	fs.writeFileSync(`${os.tmpdir()}/${i.id}.png`, response.generations[0].img, 'base64');

	await i.editReply({ embeds: [stableEmbed], files: [`${os.tmpdir()}/${i.id}.png`] });
}
