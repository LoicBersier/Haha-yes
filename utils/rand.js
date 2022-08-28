import fs from 'node:fs';
export function rand(text, message) {
	// Find a value in an array of objects in Javascript - https://stackoverflow.com/a/12462387
	function search(nameKey, myArray) {
		for (let i = 0; i < myArray.length; i++) {
			if (new RegExp(myArray[i].name).test(nameKey)) {
				return myArray[i];
			}
		}
	}


	fs.readdirSync('./json/dictionary/').forEach(file => {
		file = file.slice(0, -5);
		const dictionary = JSON.parse(fs.readFileSync(`./json/dictionary/${file}.json`));
		const re = new RegExp('\\[' + file + '\\]');
		do {
			text = text.replace(re, dictionary[Math.floor((Math.random() * dictionary.length))]);
		} while (text.includes(`[${file}]`));
		return text;
	});

	const variables = [
		{
			name: /\[author\]/,
			value: message ? message.author.username : '',
		},
		{
			name: /\[member\]/,
			value: message ? message.guild ? message.guild.members.cache.random().user.username : '' : '',
		},
		{
			name: /\[memberRand\]/,
			value: (() => message.guild ? message.guild.members.cache.random().user.username : ''),
		},
		{
			name: /\[dice\d*\]/,
			value: (() => Math.floor((Math.random() * text.match(/\[dice\d*\]/g)[0].replace(/\D/g, '')) + 1)),
		},
		{
			name: /\[number\]/,
			value: (() => Math.floor((Math.random() * 9) + 1)),
		},
		{
			name: /\[kick\]/,
			value: '',
		},
		{
			name: /\[ban\]/,
			value: '',
		},
		{
			name: /\[delete\]/,
			value: '',
		},
		{
			name: /\[n\]/,
			value: '\n',
		},
	];

	const matches = text.matchAll(/\[.*?\]\s?/g);

	for (const match of matches) {
		if (search(match[0].trim(), variables)) { text = text.replace(match[0].trim(), search(match[0].trim(), variables).value); }
	}

	return text;
}
