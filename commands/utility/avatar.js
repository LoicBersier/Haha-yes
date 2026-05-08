import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Show user avatar')
		.addMentionableOption(option =>
			option.setName('member')
				.setDescription('Who do you want to fake?')
				.setRequired(false)),
	category: 'utility',
	async execute(interaction, args) {
		const avatarEmbed = new EmbedBuilder()
			.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
			.setTitle('Avatar');


		if (!args.member) {
			const extension = interaction.user.displayAvatarURL({ dynamic: true }).substr(interaction.user.displayAvatarURL({ dynamic: true }).length - 3);
			if (extension == 'gif') {
				avatarEmbed.setAuthor({ name: interaction.user.username });
				avatarEmbed.setDescription(`[gif](${interaction.user.displayAvatarURL({ extension: 'gif', size: 2048 })})`);
				avatarEmbed.setImage(interaction.user.displayAvatarURL({ extension: 'gif', size: 2048 }));
			}
			else {
				avatarEmbed.setAuthor({ name: interaction.user.username });
				avatarEmbed.setDescription(`[png](${interaction.user.displayAvatarURL({ extension: 'png', size: 2048 })}) | [jpeg](${interaction.user.displayAvatarURL({ extension: 'jpg', size: 2048 })}) | [webp](${interaction.user.displayAvatarURL({ extension: 'webp', size: 2048 })})`);
				avatarEmbed.setImage(interaction.user.displayAvatarURL({ extension: 'png', size: 2048 }));
			}
			return interaction.reply({ embeds: [avatarEmbed] });
		}
		else {
			await interaction.guild.members.fetch();
			const extension = args.member.displayAvatarURL({ dynamic: true }).substr(args.member.displayAvatarURL({ dynamic: true }).length - 3);
			if (extension == 'gif') {
				avatarEmbed.setAuthor({ name: args.member.user.username });
				avatarEmbed.setDescription(`[gif](${args.member.displayAvatarURL({ extension: 'gif', size: 2048 })})`);
				avatarEmbed.setImage(args.member.displayAvatarURL({ extension: 'gif', size: 2048 }));
			}
			else {
				avatarEmbed.setAuthor({ name: args.member.user.username });
				avatarEmbed.setDescription(`[png](${args.member.displayAvatarURL({ extension: 'png', size: 2048 })}) | [jpeg](${args.member.displayAvatarURL({ extension: 'jpg', size: 2048 })}) | [webp](${args.member.displayAvatarURL({ extension: 'webp', size: 2048 })})`);
				avatarEmbed.setImage(args.member.displayAvatarURL({ extension: 'png', size: 2048 }));
			}
			return interaction.reply({ embeds: [avatarEmbed] });
		}

	},
};
