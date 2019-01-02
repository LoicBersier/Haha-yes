const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const { token, prefix, ownerID } = require('./config.json');


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
			commandUtil: true,
			commandUtilLifetime: 600000,
			allowMention: true,
			handleEdits: true,
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './inhibitors/',
			emitters: {
				process
			},
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: './listeners/'
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