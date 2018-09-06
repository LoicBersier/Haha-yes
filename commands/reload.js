exports.run = (client, message, args) => {
    if (message.author.id == "267065637183029248") {
    if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
    const commandName = args[0];

    if(!client.commands.has(commandName)) {
        return message.reply("That command does not exist");
    }

    delete require.cache[require.resolve(`./${commandName}.js`)];

    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.reply(`The command ${commandName} has been reloaded`);
};
}