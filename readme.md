# Haha Yes

A multi function discord bot.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine

### Prerequisites

You need to install the following


* ffmpeg (Optional but very recommanded: for yt-dlp to merge video/audio formats)
* yt-dlp ([a file can download it for you](prereq.js))

### Installing
```
git clone https://git.namejeff.xyz/Supositware/Haha-Yes
cd haha-Yes
git checkout slash
npm install
```

To run the bot for the first time you need to execute [deploy-commands.js](deploy-commands.js) so the commands can be registered, don't forget to set your .env accordingly.
``node deploy-commands.js``

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

## Authors

* **Loïc Bersier**

## Donation link

[![Paypal](https://www.paypalobjects.com/en_US/CH/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/paypalme2/supositware/)

## License

This project is licensed under the **GNU Affero General Public License v3.0** License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [discord.JS team](https://github.com/discordjs/discord.js)
* Tina the Cyclops girl#0064 for inspiring me for starting the making of this bot
