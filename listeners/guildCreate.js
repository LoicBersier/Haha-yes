const { Listener } = require('discord-akairo');
const { statsChannel } = require('../config.json');


class guildCreateListener extends Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            eventName: 'guildCreate'
        });
    }

    async exec(guild, client) {
            console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}`);
            const channel = this.client.channels.get(statsChannel);
            const addEmbed = new Discord.RichEmbed()
            .setColor("#52e80d")
            .setTitle('Someone added me ! YAY :D')
            .setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
            .setThumbnail(guild.iconURL)
            .setDescription(`${guild.name}\n${guild.id}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\n(${guild.owner.id})`)
            .setTimestamp()
    
            channel.send({ embed: addEmbed });
    }
}
module.exports = guildCreateListener;