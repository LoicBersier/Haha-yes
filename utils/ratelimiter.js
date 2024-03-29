const ratelimit = {};
const parallelLimit = {};
const { ownerId, NODE_ENV } = process.env;

import db from '../models/index.js';

export default {
	check,
	addParallel,
	removeParallel,
	checkParallel,
};
async function check(user, commandName, commands) {
	const userID = user.id;
	const userTag = user.username;

	// Don't apply the rate limit to bot owner
	if (NODE_ENV !== 'development') {
		if (user.id === ownerId) {
			return false;
		}
	}

	if (!ratelimit[userID]) {
		ratelimit[userID] = {};
	}

	const date = new Date();
	if (ratelimit[userID][commandName]) {
		if (ratelimit[userID][commandName].cooldown && ratelimit[userID][commandName].limit === commands.ratelimit) {
			if (date > ratelimit[userID][commandName].cooldown) {
				ratelimit[userID][commandName].limit = 0;
				ratelimit[userID][commandName].cooldown = undefined;
			}
		}

		if (commands.ratelimit === ratelimit[userID][commandName].limit) {
			const seconds = Math.floor((ratelimit[userID][commandName].cooldown - date) / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			const dateString = `${hours > 0 ? ` ${Math.floor(hours)} hours` : ''}${minutes > 0 ? ` ${Math.floor(minutes % 60)} minutes` : ''}${seconds > 0 ? ` ${Math.floor(seconds % 60)} seconds` : ''}`;

			const isOptOut = await db.optout.findOne({ where: { userID: userID } });

			const timestamp = new Date();
			console.log(`[${timestamp.toISOString()}] \x1b[33m${ isOptOut ? 'A user' : `${userTag} (${userID})`}\x1b[0m is rate limited on \x1b[33m${commandName}\x1b[0m for${dateString}.`);

			return `You are being rate limited. You can try again in${dateString}.`;
		}
	}


	if (commands.ratelimit) {
		date.setSeconds(date.getSeconds() + commands.cooldown);
		ratelimit[userID][commandName] = { limit: ratelimit[userID][commandName] ? ratelimit[userID][commandName].limit + 1 : 1, cooldown: date };
	}

	return false;
}

async function addParallel(commandName) {
	// console.log(`[ADD] Adding parallel to ${commandName}`);
	if (!parallelLimit[commandName]) parallelLimit[commandName] = 0;

	const prevNumber = parallelLimit[commandName];

	// console.log(`[ADD] Previous parallel executions: ${prevNumber}`);
	// console.log(`[ADD] Current parallel executions: ${JSON.stringify(parallelLimit)}`);
	parallelLimit[commandName] = prevNumber + 1;
}

async function removeParallel(commandName) {
	// console.log(`[REMOVE] Removing parallel to ${commandName}`);

	// This shouldn't be possible
	if (!parallelLimit[commandName]) parallelLimit[commandName] = 0;

	const prevNumber = parallelLimit[commandName];

	// console.log(`[REMOVE] previous number: ${prevNumber}`);
	// console.log(`[REMOVE] previous parallel limit: ${JSON.stringify(parallelLimit)}`);
	parallelLimit[commandName] = prevNumber - 1;
	// console.log(`[REMOVE] current parallel limit: ${JSON.stringify(parallelLimit)}`);
}

async function checkParallel(user, commandName, command) {
	// Don't apply the rate limit to bot owner
	if (NODE_ENV !== 'development') {
		if (user.id === ownerId) {
			return false;
		}
	}

	if (!parallelLimit[commandName]) parallelLimit[commandName] = 0;

	// console.log(`[CHECK] command limit: ${command.parallelLimit}`);
	// console.log(`[CHECK] current parallel executions: ${parallelLimit[commandName]}`);
	if (parallelLimit[commandName] >= command.parallelLimit) {
		return { limited: true, current: parallelLimit[commandName], max: command.parallelLimit, msg: `There are currently too many parallel execution of this command, please wait before retrying. (${parallelLimit[commandName]}/${command.parallelLimit})` };
	}

	return { limited: false, current: parallelLimit[commandName], max: command.parallelLimit };
}