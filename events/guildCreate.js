module.exports = (client) => {
    console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`);
    const channel = client.channels.get(statsChannel);
    const addEmbed = {
        color: 0x008000,
        title: 'Someone added the bot! :D YAY',
        description: `${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner}`,
        timestamp: new Date(),
    };
    
    channel.send({ embed: addEmbed });
};