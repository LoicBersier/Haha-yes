const { Command } = require('discord.js-commando');
const printer = require('printer');
module.exports = class printCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print',
            group: 'owner',
            memberName: 'print',
            description: 'print what you write',
            ownerOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want to print',
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
    }
};