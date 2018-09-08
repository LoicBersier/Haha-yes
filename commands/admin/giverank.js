const { Command } = require('discord.js-commando');
module.exports = class GiveRankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'giverank',
            group: 'admin',
            memberName: 'giverank',
            description: 'Assign a rank to the mentionned user',
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Wich member should get the rank',
                    type: 'member',
                },
                {
                    key: 'rank',
                    prompt: 'Wich rank to give to the user?',
                    type: 'string',
                }
            ]
        });
    }

    run(message, { rank, member }) {
        const role = message.guild.roles.find('name', rank);
        member = message.mentions.members.first();
        if (!role) {
            message.say("The rank you tried to assign dosent exist ( or bot have a lower rank than the one you tried to assign");
        } else
        member.addRole(role);
        message.say(`You successfully gived the rank **${rank}** to **${member}**`);
    }
};