const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const { yandexTRN, yandexDICT } = require('../../config.json');

class translateCommand extends Command {
	constructor() {
		super('translate', {
			aliases: ['translate', 'trn'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			args: [
				{
					id: 'language',
					type: ['az','ml','sq','mt','am','mk','en','mi','ar','mr','hy','mhr','af','mn','eu','de','ba','ne','be','no','bn','pa','my','pap','bg','fa','bs','pl','cy','pt','hu','ro','vi','ru','ht','ceb','gl','sr','nl','si','mrj','sk','el','sl','ka','sw','gu','su','da','tg','he','th','yi','tl','id','ta','ga','tt','it','te','is','tr','es','udm','kk','uz','kn','uk','ca','ur','ky','fi','zh','fr','ko','hi','xh','hr','km','cs','lo','sv','la','gd','lv','et','lt','eo','lb','jv','mg','ja','ms'],
					prompt: {
						start: 'In what language do you want to translate it to',
						retry: 'That\'s not a valid language! try again.'
					},
					default: 'en'
				},
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'What sentences/words do you want to translate?',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Translate what you send in your desired language. You can find the language code here: https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/',
				usage: '[language code] [Text to translate]',
				examples: ['fr "What are we doing today?"', 'en "Que faisons-nous aujourd\'hui?"']
			}
		});
	}

	async exec(message, args) {
		let language = args.language;
		let text = args.text;

		let textURI = encodeURI(text);
		fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexTRN}&text=${textURI}&lang=${language}&options=1`, {
		}).then((response) => {
			return response.json();
		}).then((response) => {
			if (response.code == '502')
				return message.channel.send(`${response.message}, you probably didn't input the correct language code, you can check them here! https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/`);
			else if (response.code == '408')
				return message.channel.send(response.message);
			else if (response.code != '200') {
				console.error(response);
				return message.channel.send('An error has occurred');
			}

			let description = response.text[0];
			let lang = response.detected.lang;

			// Lookup in yandex dictionary the translated word and find other word for it
			fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${yandexDICT}&lang=${language}-${language}&text=${encodeURI(response.text[0])}`, {
			}).then((response) => {
				return response.json();
			}).then((response) => {
				console.log(response);
				if (response.code == '501') return message.channel.send(response.message);
				// If it didn't find anything in the dictionary simply send the translation
				if (response.def.length == 0) {
					const translationEmbed = this.client.util.embed()
						.setColor(message.member ? message.member.displayHexColor : 'NAVY')
						.setTitle('Asked for the following translation:')
						.setURL('https://tech.yandex.com/dictionary/')
						.setAuthor(message.author.username)
						.addField('Translated text', description)
						.addField('Translated from', lang)
						.setTimestamp()
						.setFooter('Powered by Yandex.Translate');

					return message.channel.send(translationEmbed);
				}
		
				let dict = '';

				if (response.def[0].ts == undefined)
					description = `${response.def[0].pos} - ${response.def[0].text}`;
				else
					description = `${response.def[0].pos} - ${response.def[0].text} - [${response.def[0].ts}]`;
		
				for (let i = 0; i < response.def[0].tr.length; i++ ) {
					dict += `\n${response.def[0].tr[i].pos} - ${response.def[0].tr[i].text} `;
				}	

				const translationEmbed = this.client.util.embed()
					.setColor(message.member ? message.member.displayHexColor : 'NAVY')
					.setTitle('Asked for the following translation:')
					.setURL('https://tech.yandex.com/dictionary/')
					.setAuthor(message.author.username)
					.addField('Translated text', description)
					.addField('Dictionary', dict)
					.addField('Translated from', lang)
					.setTimestamp()
					.setFooter('Powered by Yandex.Translate & Yandex.Dictionary');

				return message.channel.send(translationEmbed);
			});

		});
	}
}

module.exports = translateCommand;