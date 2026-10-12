import { EmbedBuilder } from "discord.js";
import db from "../../../models/index.js";

export default {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    const isOwnerOptOut = await db.optout.findOne({
      where: { userID: message.author.id },
    });

    if (isOwnerOptOut) {
      return;
    }

    const quotationstat = await db.quotationStat.findOne({
      where: { serverID: message.guild.id, stat: "enable" },
    });

    if (
      quotationstat &&
      (message.content.includes("discordapp.com/channels/") ||
        message.content.includes("discord.com/channels/"))
    ) {
      const url = message.content.split("/");
      const guildID = url[4];
      const channelID = url[5];
      const messageID = url[6].split(" ")[0];

      // Verify if the guild, channel and message exist
      const guild = client.guilds.resolve(guildID);
      if (!guild) return;
      const channel = client.channels.resolve(channelID);
      if (!channel) return;
      const quote = await channel.messages.fetch(messageID).catch(() => {
        return;
      });
      if (!quote) return;

      const isQuotedOptOut = await db.optout.findOne({
        where: { userID: message.author.id },
      });

      if (isQuotedOptOut) {
        return;
      }

      const Embed = new EmbedBuilder()
        .setAuthor({
          name: quote.author.username,
          iconURL: quote.author.displayAvatarURL(),
        })
        .setColor(message.member ? message.member.displayHexColor : "Navy")
        .addFields(
          {
            name: "Jump to",
            value: `[message](https://discordapp.com/channels/${message.guild.id}/${channelID}/${messageID})`,
            inline: true,
          },
          {
            name: "In channel",
            value: quote.channel.name.toString(),
            inline: true,
          },
          {
            name: "Quoted by",
            value: message.author.toString(),
            inline: true,
          },
        )
        .setDescription(quote.content)
        .setTimestamp(quote.createdTimestamp);

      if (quote.member)
        Embed.setAuthor({
          name: `${quote.author.username}#${quote.author.discriminator}`,
          iconURL: quote.author.displayAvatarURL(),
        });

      if (quote.author.bot)
        Embed.setAuthor({
          name: `${quote.author.username}#${quote.author.discriminator} (BOT)`,
          iconURL: quote.author.displayAvatarURL(),
        });

      if (guild.id != message.guild.id)
        Embed.addFields({
          name: "In guild",
          value: guild.name,
          inline: true,
        });
      const Attachment = Array.from(message.attachments.values());
      if (Attachment[0]) Embed.setImage(Attachment[0].url);

      return message.channel.send({ embeds: [Embed] });
    }
  },
};
