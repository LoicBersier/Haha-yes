const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            eventName: 'commandBlocked'
        });
    }

    exec(message, command, reason) {
        console.log(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
        switch(reason) {
            case "Owner":
                message.reply('Nice try but you aren\'t the owner <a:memed:433320880135733248>');
                break;
            case "clientPermissions":
                message.reply('Im missing the required permissions for this command!');
                break;
            case "userPermissions":
                message.reply('You are missing some permissions to use this command!');
                break;
            case "blacklist": 
                message.reply('You can\'t use this command because you have been blacklisted!')
            
        }
    }
}

module.exports = CommandBlockedListener;