exports.run = (client, message) => {
    message.channel.send({embed: {
        color: 3447003,
        title: "Help",
        description: "Ping: Pong! \n Kick: Kick people from the server (Staff only) {haha kick (mention user)(reasons)} \n Reload: reload a specific command without rebooting the bot (owner only) {haha reload (name of commands)} \n Eval: let the owner do any commands {haha eval (the command)}",
        timestamp: new Date(),
      }
    });
}