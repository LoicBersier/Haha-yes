import { SlashCommandBuilder } from 'discord.js';
import { rand } from '../../utils/rand.js';
import { execFile } from 'node:child_process';

export default {
	data: new SlashCommandBuilder()
		.setName('dectalk')
		.setDescription('Send a .wav sound file of what you wrote with dectalk')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Write something so I can talk it back with dectalk.')
				.setRequired(true)),
	category: 'voice',
	async execute(interaction, args) {
		args.message = rand(args.message, interaction);
		const output = `${interaction.id}_dectalk.wav`;
		const message = '[:phoneme on]' + args.message;
		await interaction.deferReply({ ephemeral: false });

		if (process.platform === 'win32') {
			// Untested, most likely do not work.
			execFile('say.exe', ['-w', output, `${message}`], { cwd: './bin/dectalk/' }, (error, stdout, stderr) => {
				sendMessage(output, error, stdout, stderr);
			});
		}
		else if (process.platform === 'linux' || process.platform === 'darwin') {
			execFile('wine', ['say.exe', '-w', output, `${message}`], { cwd: './bin/dectalk/' }, (error, stdout, stderr) => {
				sendMessage(`./bin/dectalk/${output}`, error, stdout, stderr);
			});
		}

		async function sendMessage(file, error, stdout, stderr) {
			if (error) {
				console.error(stderr);
				console.error(error);
				return interaction.editReply('Oh no! an error has occurred!');
			}

			return interaction.editReply({ files: [file] });
		}

	},
};
