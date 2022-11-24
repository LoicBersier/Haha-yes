import { SlashCommandBuilder } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';
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
	category: 'fun',
	clientPermissions: [ PermissionFlagsBits.ManageWebhooks ],
	async execute(interaction, args) {
		await interaction.deferReply({ ephemeral: true });
		await interaction.guild.members.fetch();
		const member = args.user;
		const message = args.message;
		const attachment = args.image;
		const username = member.nickname ? member.nickname : member.user.username;

		const webhook = await interaction.channel.createWebhook({
			name: username,
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
		if (interaction.isMessage) {
			await interaction.delete();
			await interaction.deleteReply();
		}
		else {
			await interaction.editReply({ content: `Faked the user ${member}` });
		}
	},
};
