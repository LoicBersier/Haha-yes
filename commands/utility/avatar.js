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
			const format = interaction.user.displayAvatarURL({ dynamic: true }).substr(interaction.user.displayAvatarURL({ dynamic: true }).length - 3);
			if (format == 'gif') {
				avatarEmbed.setAuthor({ name: interaction.user.username });
				avatarEmbed.setDescription(`[gif](${interaction.user.displayAvatarURL({ format: 'gif', size: 2048 })})`);
				avatarEmbed.setImage(interaction.user.displayAvatarURL({ format: 'gif', size: 2048 }));
			}
			else {
				avatarEmbed.setAuthor({ name: interaction.user.username });
				avatarEmbed.setDescription(`[png](${interaction.user.displayAvatarURL({ format: 'png', size: 2048 })}) | [jpeg](${interaction.user.displayAvatarURL({ format: 'jpg', size: 2048 })}) | [webp](${interaction.user.displayAvatarURL({ format: 'webp', size: 2048 })})`);
				avatarEmbed.setImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));
			}
			return interaction.reply({ embeds: [avatarEmbed] });
		}
		else {
			await interaction.guild.members.fetch();
			const format = args.member.displayAvatarURL({ dynamic: true }).substr(args.member.displayAvatarURL({ dynamic: true }).length - 3);
			if (format == 'gif') {
				avatarEmbed.setAuthor({ name: args.member.user.username });
				avatarEmbed.setDescription(`[gif](${args.member.displayAvatarURL({ format: 'gif', size: 2048 })})`);
				avatarEmbed.setImage(args.member.displayAvatarURL({ format: 'gif', size: 2048 }));
			}
			else {
				avatarEmbed.setAuthor({ name: args.member.user.username });
				avatarEmbed.setDescription(`[png](${args.member.displayAvatarURL({ format: 'png', size: 2048 })}) | [jpeg](${args.member.displayAvatarURL({ format: 'jpg', size: 2048 })}) | [webp](${args.member.displayAvatarURL({ format: 'webp', size: 2048 })})`);
				avatarEmbed.setImage(args.member.displayAvatarURL({ format: 'png', size: 2048 }));
			}
			return interaction.reply({ embeds: [avatarEmbed] });
		}

	},
};
