exports.random = function (text, message) {
	//	  Generate a random number
	function randNumber(file) {
		let Rand = Math.floor((Math.random() * file.length));
		return Rand;
	}

	const fs = require('fs');

	fs.readdirSync('./dictionary/').forEach(file => {
		file = file.slice(0, -5);
		const dictionary = require(`./dictionary/${file}`);
		const re = new RegExp('\\[' + file + '\\]');
		do {
			text = text.replace(re, dictionary[randNumber(dictionary)]);
		} while(text.includes(`[${file}]`));
		return text;
	});

	do {
		if (message) {
			if (message.member) {
				text = text.replace(/\[author\]/, message.author.username);
				text = text.replace(/\[member\]/g, message.guild.members.cache.random().user.username);
				text = text.replace(/\[memberRand\]/, message.guild.members.cache.random().user.username);
			}
		}
		text = text.replace(/\[number\]/, Math.floor((Math.random() * 9) + 1));
		text = text.replace(/\[kick\]/, ' ');
		text = text.replace(/\[ban\]/, ' ');
		text = text.replace(/\[delete\]/, ' ');
		text = text.replace(/\{n\}/, '\n');
		//	  Verify if it replaced everything
	} while( text.includes('[member]') || text.includes('[memberRand]') || text.includes('[number]') || text.includes('[author]') || text.includes('[kick]') || text.includes('[ban]') || text.includes('{n}' || text.includes('[delete]')));

	return text;
};
