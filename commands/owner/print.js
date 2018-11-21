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
        printer.printDirect({data:text, printer:'HP-Color-LaserJet-CM1312-MFP'
	, type: 'TEXT' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
	, success:function(jobID){
		console.log("sent to printer with ID: "+jobID);
	}
	, error:function(err){console.log(err);}
});

message.say("Printing now!")
    }
};