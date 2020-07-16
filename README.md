# Haha Yes

A multi function discord bot.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine

### Prerequisites

You need to install the following


* https://github.com/Automattic/node-canvas
* sequelize-cli (``npm install -g sequelize-cli``)
* mysql
* ffmpeg (Optional but recommanded: for all command that require to interact with voice chat and [vid2gif.js](commands/utility/vid2gif.js), [vidshittyfier.js](commands/fun/vidshittyfier.js) and [ytp.js](commands/fun/ytp.js))
* handbrake-cli (Optional but recommanded: for [download.js](commands/utility/download.js))
* apngasm (Optional: for [nolight.js](commands/images/nolight))
* [Google credentials](https://cloud.google.com/docs/authentication/getting-started) (Optional: for [tts.js](commands/fun/tts/tts.js) and [ttsvc.js](commands/fun/tts/ttsvc.js), without that it will spam error on startup but not important)
* Wine (Optional: required for linux/mac for [dectalk.js](commands/fun/tts/dectalk.js) and [dectalkvc.js](commands/fun/tts/dectalkvc.js))
* xvfb (Optional: for wine if using headless server)
* waon (Optional: used to convert sound files to midi for [midify.js](commands/fun/midify.js))
* timidity (Optional: used to convert the midi files back to mp3 for [midify.js](commands/fun/midify.js))

### Installing
```
git clone https://gitlab.com/loicbersier/discordbot
cd discordbot
npm install

sequelize db:migrate
```

If the youtube-dl module didn't install youtube-dl by himself you can go in ``node_modules/youtube-dl/scripts`` and run ``node download.js``
Configure [config.json](config-exemple.jsonc) and [config/config.json](config/config-example.json )

To run the bot either use pm2
```
npm install -g pm2
pm2 start index.js --name(insert name)
```
or with node ``node index.js``

If on linux you can also do

``nohup node index.js &``

To use [ytp.js](commands/fun/ytp.js)
1. Download the folder 'sounds', 'music', 'resources', 'sources' from [YTPPlus](https://github.com/philosophofee/YTPPlus)
2. Put them in the [asset/ytp](asset/ytp) folder

To use dectalk on linux you will need
1. Get dectalk 
2. install wine
3. install Xvfb & run `Xvfb :0 -screen 0 1024x768x16 &`

## Built With

* [Discord.JS](https://github.com/discordjs/discord.js) - The discord api used
* [Discord-Akairo](https://github.com/1Computer1/discord-akairo) - The framework used for Discord.JS

## Authors

* **Loïc Bersier**

## Donation link

[![Paypal](https://www.paypalobjects.com/en_US/CH/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/paypalme2/supositware/)

## License

This project is licensed under the **GNU Affero General Public License v3.0** License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [discord.JS team](https://github.com/discordjs/discord.js)
* [1computer1](https://github.com/1Computer1/) for discord-akairo & the help command from [hoshi](https://github.com/1Computer1/hoshi)
* [Rantionary](https://github.com/RantLang/Rantionary) for there dictionnary.
* Tina the Cyclops girl#0064 for inspiring me for making this bot
* [Jetbrains](https://www.jetbrains.com/?from=Hahayesdiscordbot) for providing their IDE free of charges! 

<img src="https://its.gamingti.me/XT8F.svg" width=20%></img>
