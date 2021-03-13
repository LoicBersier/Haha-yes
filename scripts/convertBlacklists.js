const TwitterBlacklist = require('../models').TwitterBlacklist;
const ytpblacklist = require('../models').ytpblacklist;
const userBlacklist = require('../models').userBlacklist;
const guildBlacklist = require('../models').guildBlacklist;
const Blacklists = require('../models').Blacklists;

console.log('Starting conversions');

convert(userBlacklist, 'global');
convert(ytpblacklist, 'ytp');
convert(TwitterBlacklist, 'tweet');
convert(guildBlacklist, 'guild');

console.log('Conversion finished.');

async function convert(database, type) {
	const prefix = `[${type}]`;
	console.log(`${prefix} Starting conversion`);
	let db = await  database.findAll();
	for (let dbKey in db) {
		let reason = 'No reason specified.';
		let uid;

		if (db[dbKey].guildID != undefined)
			uid = db[dbKey].guildID;
		else
			uid = db[dbKey].userID;

		if (uid == undefined)
			return console.error(`${prefix}: FATAL ERROR`);

		if (db[dbKey].reason != undefined)
			reason = db[dbKey].reason;

		const body = {type: type, uid: uid, reason: reason};

		Blacklists.findOrCreate({where: body, defaults: body})
			.catch(err => {
				console.error(`${prefix}: ${err}`);
			})
			.then(() => {
				console.log(`${prefix}: Successfully converted table`);
			});
	}
}