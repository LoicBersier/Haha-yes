import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'node:fs';
import os from 'node:os';

const { stableHordeApi } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('stablediffusion')
		.setDescription('AI generated image with stable diffusion (This can take very long)')
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('What do you want the AI to generate?')
				.setRequired(true)),
	category: 'fun',
	async execute(interaction, args, client) {
		await interaction.deferReply();
		generate(interaction, args.prompt);

		client.on('interactionCreate', async (interactionMenu) => {
			if (interaction.user !== interactionMenu.user) return;
			if (!interactionMenu.isButton) return;
			if (interactionMenu.customId === `regenerate${interactionMenu.user.id}`) {
				await interactionMenu.deferReply();
				await generate(interactionMenu, args.prompt);
			}
		});
	},
};

async function generate(i, prompt) {
	const body = {
		prompt: prompt,
		params: {
			n: 1,
			width: 512,
			height: 512,
		},
		nsfw: true,
		censor_nsfw: i.channel.nsfw ? true : false,
	};

	const fetchParameters = {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json', 'apikey': stableHordeApi },
	};

	let response = await fetch('https://stablehorde.net/api/v2/generate/sync', fetchParameters);

	response = await response.json();
	const stableEmbed = new EmbedBuilder()
		.setColor(i.member ? i.member.displayHexColor : 'Navy')
		.setTitle(prompt)
		.setURL('https://aqualxx.github.io/stable-ui/')
		.setFooter({ text: `Seed: ${response.generations[0].seed} worker ID: ${response.generations[0].worker_id} worker name: ${response.generations[0].worker_name}` });

	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId(`regenerate${i.user.id}`)
				.setLabel('🔄')
				.setStyle(ButtonStyle.Primary),
		);

	fs.writeFileSync(`${os.tmpdir()}/${i.id}.png`, response.generations[0].img, 'base64');

	await i.editReply({ embeds: [stableEmbed], components: [row], files: [`${os.tmpdir()}/${i.id}.png`] });
}
