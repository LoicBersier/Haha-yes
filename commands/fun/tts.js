const { Command } = require('discord.js-commando');
const googleTTS = require('google-tts-api');
const SelfReloadJSON = require('self-reload-json');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const urlParse  = require('url').parse;

module.exports = class BadMemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tts',
            group: 'fun',
            memberName: 'tts',
            description: `Return what you type in a tts file`,
            ownerOnly: true,

            args: [
                {
                    key: 'text',
                    prompt: 'What do you want to be said',
                    type: 'string',
                    validate: text => text.length < 201,
                }
            ]
        });
    }

    async run(message, { text }) {
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)

        function downloadFile (url, dest) {
            return new Promise(function (resolve, reject) {
              var info = urlParse(url);
              var httpClient = info.protocol === 'https:' ? https : http;
              var options = {
                host: info.host,
                path: info.path,
                headers: {
                  'user-agent': 'WHAT_EVER'
                }
              };
          
              httpClient.get(options, function(res) {
                // check status code
                if (res.statusCode !== 200) {
                  reject(new Error('request to ' + url + ' failed, status code = ' + res.statusCode + ' (' + res.statusMessage + ')'));
                  return;
                }
          
                var file = fs.createWriteStream(dest);
                file.on('finish', function() {
                  // close() is async, call resolve after close completes.
                  file.close(resolve);
                });
                file.on('error', function (err) {
                  // Delete the file async. (But we don't check the result)
                  fs.unlink(dest);
                  reject(err);
                });
          
                res.pipe(file);
              })
              .on('error', function(err) {
                reject(err);
              })
              .end();
            });
          }
          
          // start
          googleTTS(text)
          .then(function (url) {
            console.log(url);
          
            var dest = path.resolve(__dirname, '../../tts.mp3'); // file destination
            console.log('Download to ' + dest + ' ...');
          
            return downloadFile(url, dest);
          })
          .then(function () {
            console.log('Download success');
          })
          .catch(function (err) {
            console.error(err.stack);
          });

          setTimeout(function(){
          message.say({files: ['./tts.mp3']})
      }, 2000)
}}
