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
			console.log(`\x1b[33m${userTag} (${userID})\x1b[0m is rate limited on \x1b[33m${commandName}\x1b[0m for${dateString}.`);
			return `You are being rate limited. You can try again in${dateString}.`;
		}
	}


	if (commands.ratelimit) {
		date.setSeconds(date.getSeconds() + commands.cooldown);
		ratelimit[userID][commandName] = { limit: ratelimit[userID][commandName] ? ratelimit[userID][commandName].limit + 1 : 1, cooldown: date };
	}

	return false;
}