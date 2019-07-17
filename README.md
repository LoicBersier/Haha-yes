# Haha Yes

A multi function discord bot.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to install the following

```
https://github.com/Automattic/node-canvas
```

### Installing
```
git clone https://gitlab.com/loicbersier/discordbot
cd discordbot
npm init -y
npm install
```
To run the bot either use pm2
```
npm install -g pm2
pm2 start index.js --name(insert name)
```
or node
```
node index.js
```
If on linux you can also do
```
nohup node index.js &
```

To use dectalk on linux you will need
1. Get dectalk 
2. install wine
3. install Xvfb & run `Xvfb :0 -screen 0 1024x768x16 &`

You can now use the python script [buildConfig.py](https://gitlab.com/LoicBersier/DiscordBot/blob/master/buildConfig.py) to build a config.json

## Built With

* [Discord.JS](https://github.com/discordjs/discord.js) - The discord api used
* [Discord-Akairo](https://github.com/1Computer1/discord-akairo) - The framework used for Discord.JS

## Authors

* **Loïc Bersier**

## License

This project is licensed under the **GNU Affero General Public License v3.0** License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [discord.JS team](https://github.com/discordjs/discord.js)
* [1computer1](https://github.com/1Computer1/) for discord-akairo & the help command from [hoshi](https://github.com/1Computer1/hoshi)
* [Rantionary](https://github.com/RantLang/Rantionary) for there dictionnary.
* Tina the Cyclops girl#5759 for inspiring me for making this bot
