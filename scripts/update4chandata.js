import fetch from 'node-fetch';
import TurndownService from 'turndown';
const turndown = new TurndownService();
import fs from 'node:fs';

fetch('https://a.4cdn.org/boards.json').then((response) => {
	return response.json();
}).then((response) => {
	const jsonObject = {};
	for (let i = 0; i < response.boards.length; i++) {
		const board = response.boards[i];
		const nsfw = !board.ws_board;
		const name = board.title;
		const description = turndown.turndown(board.meta_description);

		jsonObject[board.board] = {};
		jsonObject[board.board].nsfw = nsfw;
		jsonObject[board.board].title = name;
		jsonObject[board.board].description = description;
	}
	fs.writeFileSync('./json/4chan.json', JSON.stringify(jsonObject, null, '\t'));
});