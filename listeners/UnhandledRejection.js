const { Listener } = require('discord-akairo');

class UnhandledRejectionListener extends Listener {
    constructor() {
        super('unhandledRejection', {
            eventName: 'unhandledRejection',
            emitter: 'process'
        });
    }

    exec(error) {
        console.error(error);
    }
}

module.exports = UnhandledRejectionListener;