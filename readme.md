# Haha Yes

A multi function discord bot.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine

### Prerequisites

You need to install the following


* ffmpeg (Optional but very recommanded: for yt-dlp to merge video/audio formats and Handbrake to compress videos.)
* yt-dlp ([a file can download it for you](scripts/updateytdlp.js))
* HandBrakeCLI (For [download](commands/utility/download.js))
* gifsicle (For [vid2gif](commands/utility/vid2gif.js))
* gifki (For [vid2gif](commands/utility/vid2gif.js))
* Somewhere to upload files larger than the file limit, currently 25 mb. (I use a self hosted [XBackBone](https://github.com/SergiX44/XBackBone/) with the upload.sh script made from it, you can use anything else just need to be located in bin/upload.sh)

### Installing
```
git clone https://git.namejeff.xyz/Supositware/Haha-Yes
cd haha-Yes
git checkout slash
npm install
```

To run the bot for the first time you need to execute [deploy-commands.js](scripts/deploy-commands.js) so the commands can be registered, don't forget to set your .env accordingly.
``node scripts/deploy-commands.cjs``

then you can just run it normally.
``node index.js``

If you want to run the bot automatically you can use pm2
```
npm install -g pm2
pm2 start index.js --name (insert name)
```
If you are on linux and don't need automatic restart on crash you can just do
``nohup node index.js &``

## Built With

* [Discord.JS](https://github.com/discordjs/discord.js)
* [yt-dlp](https://github.com/yt-dlp/yt-dlp)
* [HandBrakeCLI](https://github.com/HandBrake/HandBrake)
* [gifsicle](https://github.com/kohler/gifsicle)
* [gifski](https://github.com/ImageOptim/gifski)

## Authors

* **Loïc Bersier**

## Donation link

https://libtar.de/donate.html

## License

This project is licensed under the **GNU Affero General Public License v3.0** License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [discord.JS team](https://github.com/discordjs/discord.js)
* Tina the Cyclops girl#0064 for inspiring me for starting the making of this bot
