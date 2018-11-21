const { Command } = require('discord.js-commando');
const printer = require('printer');
module.exports = class printCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print',
            group: 'fun',
            memberName: 'print',
            description: 'print whatever you want using the dev printer ! ( yea really, send a feedback requesting the image and i\'il send it to you.',
            throttling: {
                usages: 1,
                duration: 86400,
            },
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want to print? ( text only )',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
        printer.printDirect({data:`Printed by: ${message.author.username}\n${text}`
	, type: 'TEXT' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
	, success:function(jobID){
        console.log("sent to printer with ID: "+jobID);
        message.say("Printing now!")
	}
	, error:function(err){console.log(err); message.say("An error has occured, the printer is most likely disconnected, try again later")}
});
    }
};