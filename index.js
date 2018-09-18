const { CommandoClient, Command } = require('discord.js-commando');
const path = require('path');
const { token, prefix, ownerID, supportServer } = require('./config.json');
const fs = require("fs");

//  Prefix and ownerID and invite to support server
const client = new CommandoClient({
    commandPrefix: prefix,
    owner: ownerID,
    invite: supportServer,
    unknownCommandResponse: false,
    disableEveryone: true,
});
//  Command groups
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun',     'Fun'],
        ['utility', 'Utility'],
        ['admin',   'Admins'],
        ['owner',   'Owner'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      // If the file is not a JS file, ignore it (thanks, Apple)
      if (!file.endsWith(".js")) return;
      // Load the event file itself
      const event = require(`./events/${file}`);
      // Get just the event name from the file name
      let eventName = file.split(".")[0];
      // super-secret recipe to call events with all their proper arguments *after* the `client` var.
      // without going into too many details, this means each event will be called with the client argument,
      // followed by its "normal" arguments, like message, member, etc etc.
      // This line is awesome by the way. Just sayin'.
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });

    client.on('error', console.error);

    client.login(token);