const responseObject = require("../reply.json");
const { Permissions } = require('discord.js');
const flags = [
    'SEND_MESSAGES'
];
const permissions = new Permissions(flags);

module.exports = (client, message) => {
    //  Auto respond to messages
            let message_content = message.content.toLowerCase();
            if(responseObject[message_content]) {
              message.channel.send(responseObject[message_content]);
            };
    
}
