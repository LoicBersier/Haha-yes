import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
// const feedbackID = [];

export default {
	data: new SlashCommandBuilder()
		.setName('dm')
		.setDescription('Replies with Pong!')
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('The user to who you want to send the message to.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('What do you want to tell them?')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Optional attachment.')
				.setRequired(false)),
	category: 'owner',
	async execute(interaction, args, client) {
		/* Too lazy to implement that now (Watch it rest untouched for months)
		async function uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		const uuid = uuidv4();
		feedbackID[uuid] = args.message;
		*/
		await client.users.fetch(args.userid);
		const user = client.users.resolve(args.userid);
		if (!user) return interaction.reply('Not a valid ID');
		const text = args.message;

		const Embed = new EmbedBuilder()
			.setTitle('You received a message from the developer!')
			.setDescription(text)
			.setFooter({ text: `If you wish to respond use the following command: ${interaction.prefix}feedback <message>` })
			.setTimestamp();

		user.send({ embeds: [Embed] });
		return interaction.reply({ content: `DM sent to ${user.username}`, ephemeral: true });
		/*
		const Attachment = (message.attachments).array();
		if (Attachment[0]) {
			client.users.resolve(user).send(Embed, { files: [Attachment[0].url] })
				.then(() => {
					return interaction.reply(`DM sent to ${user.username}`);
				})
				.catch(() => {
					return interaction.reply(`Could not send a DM to ${user.username}`);
				});
		}
		else {
			client.users.resolve(user).send(Embed)
				.then(() => {
					return interaction.reply(`DM sent to ${user.tag}`);
				})
				.catch(() => {
					return interaction.reply(`Could not send a DM to ${user.tag}`);
				});
		}
        */
	},
};
