const { Command } = require('discord-akairo');
const axios = require('axios');

const { deepl } = require('../../config.json');

class translateCommand extends Command {
	constructor() {
		super('translate', {
			aliases: ['translate', 'trn'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			args: [
				{
					id: 'language',
					type: ['bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'hu', 'it', 'ja', 'lt', 'lv', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'zh'],
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
		let language = args.language.toUpperCase();
		let text = args.text;

		const params = new URLSearchParams();
		params.append('auth_key', deepl);
		params.append('text', text);
		params.append('target_lang', language);


		axios.post('https://api-free.deepl.com/v2/translate', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(response => {
			console.log(response.data.translations[0].text);

			const data = response.data.translations[0];

			const translationEmbed = this.client.util.embed()
				.setColor(message.member ? message.member.displayHexColor : 'NAVY')
				.setTitle('Asked for the following translation:')
				.setURL('https://www.deepl.com/translator')
				.setAuthor(message.author.username)
				.addField('Translated text', data.text)
				.addField('Translated from', data.detected_source_language)
				.setTimestamp()
				.setFooter('Powered by DeepL');

			return message.channel.send(translationEmbed);
		});


	}
}

module.exports = translateCommand;