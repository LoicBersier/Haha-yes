const { Command } = require('discord-akairo');

class SayCommand extends Command {
	constructor() {
		super('say', {
			aliases: ['say'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you say but can also replace ',
				usage: '[text]',
				examples: ['[member] is a big [adverb] [verb]']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		if (!text)
			return;

		//	  Load all the different files
		const verb = require('../../dictionary/verbs.json');
		const noun = require('../../dictionary/noun.json');
		const adjective = require('../../dictionary/adjectives.json');
		const adverbs = require('../../dictionary/adverbs.json');
		const activities = require('../../dictionary/activities.json');
		const celebreties = require('../../dictionary/celebreties.json');
		const countries = require('../../dictionary/countries.json');
		const diseases = require('../../dictionary/diseases.json');
		const elements = require('../../dictionary/elements.json');
		const hobbies = require('../../dictionary/hobbies.json');
		const music = require('../../dictionary/music.json');
		const prefixes = require('../../dictionary/prefixes.json');
		const pronouns = require('../../dictionary/pronouns.json');
		const states = require('../../dictionary/states.json');
		const titles = require('../../dictionary/titles.json');
		const units = require('../../dictionary/units.json');

		

		//	  Generate a random number
		function randNumber(file) {
			let Rand = Math.floor((Math.random() * file.length) + 1);
			return Rand;
		}
		//	  Replace with a random word from the json
		do {
			text = text.replace(/\[verb\]/, verb[randNumber(verb)]);
			text = text.replace(/\[adverb\]/, adverbs[randNumber(adverbs)]);
			text = text.replace(/\[noun\]/, noun[randNumber(noun)]);
			text = text.replace(/\[adjective\]/, adjective[randNumber(adjective)]);
			text = text.replace(/\[activity\]/, activities[randNumber(activities)]);
			text = text.replace(/\[celebrity\]/, celebreties[randNumber(celebreties)]);
			text = text.replace(/\[country\]/, countries[randNumber(countries)]);
			text = text.replace(/\[diseases\]/, diseases[randNumber(diseases)]);
			text = text.replace(/\[elements\]/, elements[randNumber(elements)]);
			text = text.replace(/\[hobbies\]/, hobbies[randNumber(hobbies)]);
			text = text.replace(/\[music\]/, music[randNumber(music)]);
			text = text.replace(/\[prefixes\]/, prefixes[randNumber(prefixes)]);
			text = text.replace(/\[pronoun\]/, pronouns[randNumber(pronouns)]);
			text = text.replace(/\[state\]/, states[randNumber(states)]);
			text = text.replace(/\[title\]/, titles[randNumber(titles)]);
			text = text.replace(/\[unit\]/, units[randNumber(units)]);
			text = text.replace(/\[member\]/, message.guild.members.random().user.username);
			text = text.replace(/\[number\]/, Math.floor((Math.random() * 9) + 1));
		//	  Verify if it replaced everything
		} while( text.includes('[verb]') || text.includes('[adverbs]') || text.includes('[noun]') || text.includes('[adjective]') || text.includes('[member]') || text.includes('[number]') || text.includes('[activities]') || text.includes('[celebrities]') || text.includes('[countries]') || text.includes('[diseases]') || text.includes('[elements]') || text.includes('[hobbies]') || text.includes('[music]') || text.includes('[prefixes]') || text.includes('[pronoun]') || text.includes('[state]') || text.includes('[title]') || text.includes('[unit]'));

		//	  Send the final text
		return message.channel.send(text);
	}
}

module.exports = SayCommand;