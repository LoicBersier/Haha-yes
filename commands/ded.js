exports.run = (client,message) => {
    if (message.author.id == "267065637183029248") {
        message.channel.send("haha yes im ded now k bye thx").catch(console.error);
        process.exit();
}
};