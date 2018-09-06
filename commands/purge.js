exports.run = (client, message, args) => {
    const user = message.mentions.users.first();
    const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
    if (!amount) return message.reply('Must specify an amount to delete!');
    if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
    message.channel.fetchMessages({
     limit: 100,
    }).then((messages) => {
     if (user) {
     const filterBy = user ? user.id : Client.user.id;
     messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
     }
     message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
    });
};