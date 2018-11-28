module.exports = function blacklist(reasons, message){
        return message.channel.send(`You have been blacklisted for the following reasons: **${reasons}**`)
}

