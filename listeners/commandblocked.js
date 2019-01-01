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
                let ownerMessage = ["Nice try but you aren't the owner <a:memed:433320880135733248>", "LOADING SUPER SECRET COMMAND <a:loadingmin:527579785212329984> Wait a minute... you aren't the owner!", "uhm, how about no"];
                let ownerMessage = ownerMessage[Math.floor( Math.random() * ownerMessage.length )];
                message.reply(ownerMessage);
                break;
            case "clientPermissions":
                message.reply('Im missing the required permissions for this command!');
                break;
            case "userPermissions":
                message.reply('You are missing some permissions to use this command!');
                break;
            case "blacklist": 
                message.reply('You can\'t use this command because you have been blacklisted!');
                break;
            
        }
    }
}

module.exports = CommandBlockedListener;