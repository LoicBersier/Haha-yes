module.exports = (client) => {
    console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}\n***BOT KICKED***`);
        const channel = client.channels.get(statsChannel);
        const kickEmbed = {
            color: 0xFF0000,
            title: 'Someone removed the bot :(',
            description: `${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`,
            timestamp: new Date(),
        };
        
        channel.send({ embed: kickEmbed });
};