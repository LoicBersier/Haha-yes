module.exports = {
    name: 'eval',
    description: 'use command',
    execute(message) {
        if (message.author.id === '267065637183029248') {
            function clean(text) {
                if (typeof(text) === "string")
                  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else
                    return text;
              }
              client.on("message", message => {
                const args = message.content.split(" ").slice(1);
              
                if (message.content.startsWith(config.prefix + "eval")) {
                  if(message.author.id !== config.ownerID) return;
                  try {
                    const code = args.join(" ");
                    let evaled = eval(code);
              
                    if (typeof evaled !== "string")
                      evaled = require("util").inspect(evaled);
              
                    message.channel.send(clean(evaled), {code:"xl"});
                  } catch (err) {
                    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
                  }
                }
              });
        }
    },
};
