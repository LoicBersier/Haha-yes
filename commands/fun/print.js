const { Command } = require('discord.js-commando');
const printer = require('printer');
const { printChannel } = require('../../config.json')
module.exports = class printCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print',
            aliases: ['dundermiffline', 'wastedevinkandmoney'],
            group: 'fun',
            memberName: 'print',
            description: 'print whatever you want using the dev printer ! ( yea really, send a feedback requesting the image and i\'il send it to you. )',
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
        const channel = this.client.channels.get(printChannel);

    
        printer.printDirect({data:`Printed by: ${message.author.username}\n\n${text}`
	, type: 'TEXT' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
	, success:function(jobID){
        console.log("sent to printer with ID: "+jobID);
        message.say("Printing now! ( You will receive your print shortly ( if the dev isint sleeping that is ))");
	}
	, error:function(err){console.log(err); message.say("An error has occured, the printer is most likely disconnected, try again later")}
});

channel.send(`${message.author.username} (${message.author.id}) Asked for a print with the following text: ${text}`);

    }
};