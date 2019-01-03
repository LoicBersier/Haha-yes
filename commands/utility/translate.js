const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { yandexAPI } = require('../../config.json');

class TranslationCommand extends Command {
	constructor() {
		super('translation', {
			aliases: ['translation', 'trn'],
			category: 'utility',
			args: [
				{
					id: 'language',
					type: ['az','ml','sq','mt','am','mk','en','mi','ar','mr','hy','mhr','af','mn','eu','de','ba','ne','be','no','bn','pa','my','pap','bg','fa','bs','pl','cy','pt','hu','ro','vi','ru','ht','ceb','gl','sr','nl','si','mrj','sk','el','sl','ka','sw','gu','su','da','tg','he','th','yi','tl','id','ta','ga','tt','it','te','is','tr','es','udm','kk','uz','kn','uk','ca','ur','ky','fi','zh','fr','ko','hi','xh','hr','km','cs','lo','sv','la','gd','lv','et','lt','eo','lb','jv','mg','ja','ms'],
					prompt: {
						retry: 'That\'s not a valid language! try again.'
					},
					default: 'en'
				},
				{
					id: 'text',
					type: 'string',
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
		fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexAPI}&text=${textURI}&lang=${language}&options=1`, {
		}).then((response) => {
			return response.json();
		}).then((response) => {
			if (response.code == '502')
				return message.channel.send(`${response.message}, you probably didin't input the correct language code, you can check them here! https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/`);
			else if (response.code != '200')
				return message.channel.send('An error has occured');


			const translationEmbed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Asked for the following translation:')
				.setAuthor(message.author.username)
				.setDescription(response.text[0])
				.addField('Original text', text)
				.addField('Translated from', response.detected.lang)
				.setTimestamp()
				.setFooter('Powered by Yandex.Translate ');

			message.channel.send(translationEmbed);
		});
	}
}

module.exports = TranslationCommand;