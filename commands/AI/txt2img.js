import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'node:fs';
import os from 'node:os';

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

	let response = await fetch('https://stablehorde.net/api/v2/generate/sync', fetchParameters);

	response = await response.json();

	let creditResponse = await fetch(`https://stablehorde.net/api/v2/users/${stableHordeID}`);
	creditResponse = await creditResponse.json();

	const stableEmbed = new EmbedBuilder()
		.setColor(i.member ? i.member.displayHexColor : 'Navy')
		.setTitle(prompt)
		.setURL('https://aqualxx.github.io/stable-ui/')
		.setFooter({ text: `**Credit left: ${creditResponse.kudos}** Seed: ${response.generations[0].seed} worker ID: ${response.generations[0].worker_id} worker name: ${response.generations[0].worker_name}` });

	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId(`regenerate${i.user.id}`)
				.setLabel('🔄 Regenerate')
				.setStyle(ButtonStyle.Primary),
		);

	fs.writeFileSync(`${os.tmpdir()}/${i.id}.png`, response.generations[0].img, 'base64');

	await i.editReply({ embeds: [stableEmbed], components: [row], files: [`${os.tmpdir()}/${i.id}.png`] });

	client.once('interactionCreate', async (interactionMenu) => {
		if (i.user !== interactionMenu.user) return;
		if (!interactionMenu.isButton) return;
		if (interactionMenu.customId === `regenerate${interactionMenu.user.id}`) {
			await interactionMenu.deferReply();
			await generate(interactionMenu, prompt, client);
		}
	});
}
