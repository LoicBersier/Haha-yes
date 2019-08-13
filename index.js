const fs = require('fs');
if (!fs.existsSync('./config.json')) {
	throw new Error('I could not find config.json, are you sure you have it?');
}
const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const { token, prefix, ownerID } = require('./config.json');
require('console-stamp')(console, '[HH:MM:ss]');


class hahaYesClient extends AkairoClient {
	constructor() {
		super({
			ownerID: ownerID,
		}, {
			disableEveryone: true
		});

		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: prefix,
			argumentDefaults: {
				prompt: {
					timeout: 'Time ran out, command has been cancelled.',
					ended: 'Too many retries, command has been cancelled.',
					retry: 'Could not find your argument, please try again!',
					cancel: 'Command has been cancelled.',
					retries: 4,
					time: 30000
				}
			},
			commandUtil: true,
			commandUtilLifetime: 60000,
			allowMention: true,
			handleEdits: true,
			ignorePermissions: ownerID,
			ignoreCooldown: ownerID,
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './event/inhibitors/',
			emitters: {
				process
			},
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: './event/listeners/'
		});

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler
		});

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.commandHandler.loadAll();
	}
}

const client = new hahaYesClient();
client.login(token);