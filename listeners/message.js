const { Listener } = require('discord-akairo');
const responseObject = require("../json/reply.json");
const reactObject = require("../json/react.json");
const imgResponseObject = require("../json/imgreply.json");
const SelfReloadJSON = require('self-reload-json');

class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            eventName: 'message'
        });
    }

    async exec(message) {
            let autoresponse = new SelfReloadJSON('./json/autoresponse.json');
            let message_content = message.content.toLowerCase();

            if (message.author.bot) return; {

    //  If autoresponse is enable send the response
                if(autoresponse[message.channel.id] == 'enable') {
    //  Reply with images as attachement
                    if(imgResponseObject[message_content]) {
                        message.channel.send({files: [imgResponseObject[message_content]]}); 
                    } 
    //  React only to the messages
                    else if(reactObject[message_content]) {
                        message.react(reactObject[message_content]);
                    }
    //  auto respond to messages
                    else if(responseObject[message_content]) {
                        message.channel.send(responseObject[message_content]);
    //  If it contain "like if" react with 👍
                    } else if (message_content.includes("like if")) {
                        message.react("\u{1F44D}")
    //  If it contain "jeff" react with a jeff emote
                    } else if (message_content.includes("jeff")) {
                        message.react("496028845967802378")
                    }
                }
                let customresponse = new SelfReloadJSON(`./tag/${message.guild.id}.json`);
    //  User autoresponse
                if(customresponse[message_content]) {
                    message.channel.send(customresponse[message_content])
                }

            }
    }
}

module.exports = MessageListener;