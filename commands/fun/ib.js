const { Command } = require('discord.js-commando');
const fetch = require('node-fetch')
const blacklist = require('../../json/blacklist.json')

module.exports = class BadMemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ib',
            aliases: ['inspirobot'],
            group: 'fun',
            memberName: 'ib',
            description: `Return a random inspiration from inspirobot`,
        });
    }

    async run(message) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

        fetch('http://inspirobot.me/api?generate=true')
        .then(res => res.text())
        .then(body => message.channel.send({files: [body]}))
}}