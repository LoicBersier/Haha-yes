import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import db from "../../models/index.js";
const commandBlock = db.commandBlock;

export default {
  data: new SlashCommandBuilder()
    .setName("commandblock")
    .setDescription(
      "Block a command. Execute that command again to unblock a command",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command you wish to block from your users."),
    ),
  category: "admin",
  integration_types: [0, 1],

  async execute(interaction, args, client) {
    if (!client.commands.has(args.command))
      return await interaction.reply("Command not found.");

    if (args.command == "commandblock")
      return await interaction.reply({
        content:
          "Whoa there, i can't let you block this command or else how would you unblock it?",
      });

    const blocked = await commandBlock.findOne({
      where: { serverID: interaction.guild.id, command: args.command },
    });

    if (!blocked) {
      const body = { serverID: interaction.guild.id, command: args.command };
      commandBlock.create(body);

      return await interaction.reply({
        content: `Blocked command ${args.command}`,
      });
    } else {
      commandBlock.destroy({
        where: { serverID: interaction.guild.id, command: args.command },
      });
      return await interaction.reply({
        content: `The command ${args.command} has been unblocked`,
      });
    }
  },
};
