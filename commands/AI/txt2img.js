import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';

const { stableHordeApi, stableHordeID } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('txt2img')
		.setDescription('AI generated image with stable diffusion (If credit are low it may be slow)')
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('What do you want the AI to generate?')
				.setRequired(true)),
	category: 'AI',
	async execute(interaction, args, client) {
		await interaction.deferReply();
		generate(interaction, args.prompt, client);
	},
};

async function generate(i, prompt, client) {
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
	};

	const fetchParameters = {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json', 'apikey': stableHordeApi },
	};

	let response = await fetch('https://stablehorde.net/api/v2/generate/async', fetchParameters);

	response = await response.json();
	let wait_time = 5000;
	let checkURL = `https://stablehorde.net/api/v2/generate/check/${response.id}`;
	const checking = setInterval(async () => {
		const checkResult = await checkGeneration(checkURL);

		if (checkResult === undefined) return;
		if (!checkResult.done) {
			if (checkResult.wait_time < 0) {
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

			const imageData = await fetch(checkResult.image);
			let imgBuffer = await imageData.arrayBuffer();
			imgBuffer = Buffer.from(imgBuffer).toString('base64');
			const img = `data:image/${imageData.headers.get('content-type')};base64,${imgBuffer}`;

			const stableEmbed = new EmbedBuilder()
				.setColor(i.member ? i.member.displayHexColor : 'Navy')
				.setTitle(prompt)
				.setURL('https://aqualxx.github.io/stable-ui/')
				.setImage(`attachment:${img}`)
				.setFooter({ text: `**Credit left: ${creditResponse.kudos}** Seed: ${checkResult.seed} worker ID: ${checkResult.worker_id} worker name: ${checkResult.worker_name}` });

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`regenerate${i.user.id}`)
						.setLabel('🔄 Regenerate')
						.setStyle(ButtonStyle.Primary),
				);

			await i.editReply({ embeds: [stableEmbed], components: [row] });

			client.once('interactionCreate', async (interactionMenu) => {
				if (i.user !== interactionMenu.user) return;
				if (!interactionMenu.isButton) return;
				if (interactionMenu.customId === `regenerate${interactionMenu.user.id}`) {
					await interactionMenu.deferReply();
					await generate(interactionMenu, prompt, client);
				}
			});
		}
	}, wait_time);
}

async function checkGeneration(url) {
	let check = await fetch(url);
	check = await check.json();

	if (!check.is_possible) {
		return { done: false, wait_time: -1 };
	}

	if (check.done) {
		if (!check.generations) {
			return { done: false, wait_time: check.wait_time * 1000 };
		}

		return { done: true, image: check.generations[0].img, seed: check.generations[0].seed, worker_id: check.generations[0].worker_id, worker_name: check.generations[0].worker_name };
	}
}
