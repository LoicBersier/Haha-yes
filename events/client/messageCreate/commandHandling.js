import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import db from "../../../models/index.js";
import ratelimiter from "../../../utils/ratelimiter.js";

const { ownerId, prefix } = process.env;
const prefixs = prefix.split(",");

export default {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    // TODO: Moving that to a dedicated function that works for both messages and interactions

    let hasPrefix = false;
    prefixs.forEach((p) => {
      if (message.content.toLowerCase().startsWith(p)) {
        hasPrefix = true;
      }
    });

    if (!hasPrefix) return;

    const messageArray = message.content
      .match(/"[^"]*"|\S+/g)
      .map((m) => (m.slice(0, 1) === '"' ? m.slice(1, -1) : m));
    let commandName = messageArray[1].toLowerCase();
    const messageArgs = messageArray.splice(2, messageArray.length);

    // Search for alias
    client.commands.find((c) => {
      if (c.alias) {
        if (c.alias.includes(commandName)) {
          commandName = c.data.name;
        }
      }
    });

    const command = client.commands.get(commandName);

    if (!command) return;

    const globalBlacklist = await db.Blacklists.findOne({
      where: { type: "global", uid: message.author.id },
    });
    const commandBlacklist = await db.Blacklists.findOne({
      where: { type: commandName, uid: message.author.id },
    });

    if (message.guild) {
      const serverBlacklist = await db.Blacklists.findOne({
        where: { type: "guild", uid: message.guild.id },
      });
      if (serverBlacklist) {
        message.reply({
          content: `This guild has been blacklisted for the following reason: \`${serverBlacklist.reason}\``,
          ephemeral: true,
        });
        return message.guild.leave();
      }
    }

    if (globalBlacklist) {
      return message.reply({
        content: `You are globally blacklisted for the following reason: \`${globalBlacklist.reason}\``,
        ephemeral: true,
      });
    } else if (commandBlacklist) {
      return message.reply({
        content: `You are blacklisted for the following reason: \`${commandBlacklist.reason}\``,
        ephemeral: true,
      });
    }

    const userTag = message.author.username;
    const userID = message.author.id;

    let isOptOut = await db.optout.findOne({
      where: { userID: message.author.id },
    });

    if (commandName === "optout") {
      isOptOut = true;
    }

    const timestamp = new Date();
    console.log(
      `[${timestamp.toISOString()}] \x1b[33m${isOptOut ? "A user" : `${userTag} (${userID})`}\x1b[0m launched command \x1b[33m${commandName}\x1b[0m using prefix`,
    );

    // Owner only check
    if (command.ownerOnly && message.author.id !== ownerId) {
      return message.reply({
        content: "❌ This command is reserved for the owner!",
        ephemeral: true,
      });
    }

    // Guild only check
    if (command.guildOnly && !message.guild) {
      return message.reply({
        content: "❌ This command only work in a server!",
        ephemeral: true,
      });
    }

    // Check if command is blocked by guild
    if (message.guild) {
      const commandBlock = await db.commandBlock.findOne({
        where: { serverID: message.guild.id, command: commandName },
      });

      if (commandBlock) {
        return message.reply({
          content: "❌ An admin has blocked this command!",
          ephemeral: true,
        });
      }
    }

    // Check if the bot has the needed permissions
    if (command.clientPermissions) {
      const clientMember = await message.guild.members.fetch(client.user.id);
      if (!clientMember.permissions.has(command.clientPermissions)) {
        return message.reply({
          content: `❌ I am missing one of the following permission(s): \`${new PermissionFlagsBits(command.clientPermissions).toArray()}\``,
          ephemeral: true,
        });
      }
    }

    // Check if the user has the needed permissions
    if (command.default_member_permissions) {
      if (!message.member.permissions.has(command.default_member_permissions)) {
        return message.reply({
          content: `❌ You are missing one of the following permission(s): \`${new PermissionFlagsBits(command.userPermissions).toArray()}\``,
          ephemeral: true,
        });
      }
    }

    // Check if the limit of parallel execution has been reached
    if (command.parallelLimit) {
      const doParallelLimit = await ratelimiter.checkParallel(
        message.author,
        commandName,
        command,
      );
      if (doParallelLimit.limited) {
        return await message.reply({
          content: doParallelLimit.msg,
          ephemeral: true,
        });
      }

      ratelimiter.addParallel(commandName);
    }

    // Check the ratelimit
    const doRateLimit = await ratelimiter.check(
      message.author,
      commandName,
      command,
    );
    if (doRateLimit) {
      return message.reply({ content: doRateLimit, ephemeral: true });
    }

    try {
      message.user = message.author;
      message.isMessage = true;
      message.prefix = `${messageArray[0]} `;

      let waitingmsg;
      const toDelete = [];
      message.deferReply = async function () {
        waitingmsg = await message.reply("The bot is thinking...");
      };
      message.followUp = async function (payload) {
        if (payload.ephemeral) {
          toDelete.push(await message.channel.send(payload));
        } else {
          await message.channel.send(payload);
        }
      };
      message.editReply = async function (payload) {
        if (waitingmsg) {
          await waitingmsg.delete();
        }
        await message.channel.send(payload);
      };
      message.deleteReply = async function () {
        if (waitingmsg) {
          await waitingmsg.delete().catch(() => {
            return;
          });
        }
      };
      message.cleanUp = async function () {
        toDelete.forEach(async (msg) => {
          msg.delete();
        });
      };

      const args = {};

      let argsToDelete = 0;
      command.data.options.forEach((obj) => {
        if (obj.type === ApplicationCommandOptionType.Attachment) {
          args[obj.name] = message.attachments.first();
          delete command.data.options[command.data.options.indexOf(obj)];
          argsToDelete++;
        }
      });

      const argsLength = command.data.options.length - argsToDelete;
      const missingRequired = [];

      for (let i = 0, j = 0; i < argsLength; i++, j++) {
        const arg = command.data.options[j];

        if (arg.required && !messageArgs[i]) {
          missingRequired.push({
            name: arg.name,
            description: arg.description,
          });
        }

        if (!messageArgs[i]) continue;

        if (arg.type === ApplicationCommandOptionType.Attachment) continue;

        let payloadName = arg.name;
        let payload = messageArgs[i];

        if (i >= argsLength - 1) {
          payload = messageArgs.slice(i).join(" ");
        }

        if (
          arg.type === ApplicationCommandOptionType.Boolean &&
          !messageArgs[i].startsWith("--")
        ) {
          continue;
        } else if (messageArgs[i].startsWith("--")) {
          payloadName = payload.substring(2);
          payload = true;
          j--;
        }

        if (
          arg.type === ApplicationCommandOptionType.Mentionable ||
          arg.type === ApplicationCommandOptionType.User
        ) {
          await message.guild.members.fetch();
          payload = message.mentions.members.first()
            ? message.mentions.members.first()
            : message.guild.members.cache.find((u) =>
                u.user.username.toLowerCase().includes(payload.toLowerCase()),
              );
        }

        args[payloadName] = payload;
      }

      if (!isOptOut && argsLength > 0) {
        console.log(
          `[${timestamp.toISOString()}] \x1b[33m⤷\x1b[0m with args ${JSON.stringify(args)}`,
        );
      }

      if (missingRequired.length > 0) {
        let missingMsg = "";
        missingRequired.forEach((arg) => {
          missingMsg += `${arg.name} | ${arg.description}\n`;
        });
        return message.reply(
          `You are missing a required argument!\n\`${missingMsg}\``,
        );
      }

      await command.execute(message, args, client).then(async () => {
        const hasPrallelLimit = await ratelimiter.checkParallel(
          message.author,
          commandName,
          command,
        );
        if (hasPrallelLimit) ratelimiter.removeParallel(commandName);
      });
    } catch (error) {
      console.error(error);
      const hasPrallelLimit = await ratelimiter.checkParallel(
        message.author,
        commandName,
        command,
      );
      if (hasPrallelLimit) ratelimiter.removeParallel(commandName);
      await message
        .reply({
          content: `There was an error while executing this command!\n\`${error}\``,
        })
        .catch(async () => {
          await message.channel.send({
            content: `There was an error while executing this command!\n\`${error}\``,
          });
        });
    }
  },
};
