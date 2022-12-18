const ratelimit = {};

export default {
	check,
};
function check(user, commandName, commands) {
	const userID = user.id;
	const userTag = user.tag;

	if (!ratelimit[userID]) {
		ratelimit[userID] = {};
	}

	const date = new Date();
	if (ratelimit[userID][commandName]) {
		if (ratelimit[userID][commandName].cooldown) {
			if (date > ratelimit[userID][commandName].cooldown) {
				ratelimit[userID][commandName].limit = 0;
				ratelimit[userID][commandName].cooldown = undefined;
			}
		}

		if (commands.ratelimit === ratelimit[userID][commandName].limit) {
			console.log(`\x1b[33m${userTag} (${userID})\x1b[0m is rate limited on \x1b[33m${commandName}\x1b[0m for ${Math.floor((ratelimit[userID][commandName].cooldown - date) / 1000)} seconds`);
			return `You are being rate limited. You can try again in ${Math.floor((ratelimit[userID][commandName].cooldown - date) / 1000)} seconds.`;
		}
	}


	if (commands.ratelimit) {
		ratelimit[userID][commandName] = { limit: ratelimit[userID][commandName] ? ratelimit[userID][commandName].limit + 1 : 1 };
		if (commands.ratelimit === ratelimit[userID][commandName].limit) {
			date.setSeconds(date.getSeconds() + commands.cooldown);

			ratelimit[userID][commandName] = { limit: ratelimit[userID][commandName].limit, cooldown: date };
		}
	}
	return false;
}