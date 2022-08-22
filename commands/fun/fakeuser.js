import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions } from 'discord.js';
export default {
	data: new SlashCommandBuilder()
		.setName('fakeuser')
		.setDescription('Fake a user with webhooks')
		.addMentionableOption(option =>
			option.setName('user')
				.setDescription('Who do you want to fake?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('What message do you want me to send?')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Optional attachment.')
				.setRequired(false)),
	clientPermissions: [ Permissions.FLAGS.MANAGE_WEBHOOKS ],
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const attachment = interaction.options.getAttachment('image');
		const message = interaction.options.getString('message');
		const member = interaction.options.getMentionable('user');

		const webhook = await interaction.channel.createWebhook(member.user.username, {
			avatar: member.user.displayAvatarURL(),
			reason: `Fakebot/user command triggered by: ${interaction.user.username}`,
		});
		if (attachment) {
			await webhook.send({ content: message, files: [attachment] });
		}
		else {
			await webhook.send({ content: message });
		}
		await webhook.delete(`Fakebot/user command triggered by: ${interaction.user.username}`);
		await interaction.editReply({ content: `Faked the user ${member}` });
	},
};
