// Take latest image in the channel
module.exports = function(message) {
	return message.channel.messages.fetch().then(messages => {
		// Could be better
		return messages.map(m => {
			let attachments = (m.attachments).array();
			if (attachments[0]) return attachments[0].url;
			else return null;
		}).filter(key => key != null)[0];
	});
};