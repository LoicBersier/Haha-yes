const { Listener } = require('discord-akairo');
const { statsChannel } = require('../config.json');


class guildCreateListener extends Listener {
    constructor() {
        super('guildDelete', {
            emitter: 'client',
            eventName: 'guildDelete'
        });
    }

    async exec(guild) {
        console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}\n***BOT KICKED***`);
        const channel = client.channels.get(statsChannel);

        const kickEmbed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setTitle('They kicked me out :(')
        .setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
        .setThumbnail(guild.iconURL)
        .setDescription(`${guild.name}\n${guild.id}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\n(${guild.owner.id})`)
        .setTimestamp()

        channel.send({ embed: kickEmbed });
        console.log('***BOT KICKED***')
    }
}

module.exports = guildCreateListener;