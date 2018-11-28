const { Command } = require('discord.js-commando');
const fetch = require('node-fetch')
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('blacklist');

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
        let blacklistJson = new SelfReloadJSON('../../json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)

        fetch('http://inspirobot.me/api?generate=true')
        .then(res => res.text())
        .then(body => message.channel.send({files: [body]}))
}}