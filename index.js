const { CommandoClient } = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path'); 
const { token, prefix, statsChannel, ownerID, supportServer } = require('./config.json');
const responseObject = require("./json/reply.json");
const reactObject = require("./json/react.json");
const imgResponseObject = require("./json/imgreply.json");
const SelfReloadJSON = require('self-reload-json');
//  Prefix and ownerID and invite to support server
const client = new CommandoClient({
    commandPrefix: prefix,
    owner: ownerID,
    invite: supportServer,
    unknownCommandResponse: false,
    disableEveryone: true,
});
//  Command groups
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun',     'Fun'],
        ['images',     'Images'],
        ['utility', 'Utility'],
        ['admin',   'Admins'],
        ['owner',   'Owner'],

    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        ping: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));
//  Ready messages
    client.on('ready', async () => {
//  Send stats to the console
        console.log(`\x1b[32mLogged in as \x1b[34m${client.user.tag}\x1b[0m! (\x1b[33m${client.user.id}\x1b[0m)`);
        console.log(`Ready to serve in \x1b[33m${client.channels.size}\x1b[0m channels on \x1b[33m${client.guilds.size}\x1b[0m servers, for a total of \x1b[33m${client.users.size}\x1b[0m users. \x1b${client.readyAt}\x1b[0m`);
//  Send stats to the "stats" channel in the support server if its not the test bot
        if (client.user.id == 377563711927484418) {
        const channel = client.channels.get(statsChannel);
        channel.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users. ${client.readyAt}`);
        client.user.setActivity(`${prefix} feedback <feedback> to tell me what you think of the bot! | ${prefix} help`);    }
});

//  When bot join a guild send embeds with details about it.
    client.on("guildCreate", async guild => {
        console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}`);
        const channel = client.channels.get(statsChannel);
        const addEmbed = new Discord.RichEmbed()
        .setColor("#52e80d")
        .setTitle('Someone added me ! YAY :D')
        .setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
        .setThumbnail(guild.iconURL)
        .setDescription(`${guild.name}\n${guild.id}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\n(${guild.owner.id})`)
        .setTimestamp()
        
        channel.send({ embed: addEmbed });
    });

//  When bot get kicked from a guild send embeds with details about it.
    client.on("guildDelete", async guild => {
        console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}\n***BOT KICKED***`);
        const channel = client.channels.get(statsChannel);

        const kickEmbed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setTitle('They kicked me out :(')
        .setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
        .setThumbnail(guild.iconURL)
        .setDescription(`${guild.name}\n${guild.id}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\n(${guild.owner.id})`)
        .setTimestamp()

        console.log('***BOT KICKED***')
        channel.send({ embed: kickEmbed });
    });


    client.on("message", async (message) => {
        try {
            var customresponse = new SelfReloadJSON(`./tag/${message.guild.id}.json`)
            var autoresponse = new SelfReloadJSON('./json/autoresponse.json');

            let message_content = message.content.toLowerCase();
// fix a stupid bug that happen for idk wich reasons pls why tf it happen
            if (message_content == ('stop')) return;
            if (message_content == ('is')) return;
            if (message_content == ('on')) return;
            if (message_content == ('once')) return;
            if (message_content == ('save')) return;
            
            if (message.author.bot) return; {
    
    //  User autoresponse
                if(customresponse[message_content]) {
                    message.channel.send(customresponse[message_content])
                }
    //  If autoresponse is enable send the response
                if(autoresponse[message.channel.id] == 'enable') {
    //  Reply with images as attachement
                    if(imgResponseObject[message_content]) {
                        message.channel.send({files: [imgResponseObject[message_content]]}); 
                    } 
    //  React only to the messages
                    else if(reactObject[message_content]) {
                        message.react(reactObject[message_content]);
                    }
    //  auto respond to messages
                    else if(responseObject[message_content]) {
                        message.channel.send(responseObject[message_content]);
    //  If it contain "like if" react with 👍
                    } else if (message_content.includes("like if")) {
                        message.react("\u{1F44D}")
    //  If it contain "jeff" react with a jeff emote
                    } else if (message_content.includes("jeff")) {
                        message.react("496028845967802378")
                    }
                }}
        } catch(err) {
            console.error(err)
        }
    })

//  Very basic starboard
    client.on('messageReactionAdd', async (reaction, message) => {
        let messageContent = reaction.message.content;
        let messageAttachments = reaction.message.attachments.map(u=> `${u.url}`);
        let messageAuthor = reaction.message.author.username;
        let messageChannel = reaction.message.channel.name;

        if (reaction.emoji.name === '🌟' && reaction.count === 4) {
            const channel = client.channels.find(channel => channel.name === "starboard");
            channel.send(`From the channel: **${messageChannel}**\n${messageAuthor}\n${messageContent}\n${messageAttachments}`)
            .catch
            console.error('There is no starboard')
        }

        if (reaction.emoji.name === '✡' && reaction.count === 4) {
            const channel = client.channels.find(channel => channel.name === "shameboard");
            channel.send(`From the channel: **${messageChannel}**\n${messageAuthor}\n${messageContent}\n${messageAttachments}`)
            .catch 
            console.error('There is no shameboard')
        }
    })
    
    client.on('error', console.error);
    process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

    client.login(token);