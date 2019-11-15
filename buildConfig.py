import json
import os

print('Welcome to Haha Yes config builder.')

print('which config version do you want?')
version = input('"A" for minimum, "B" for recommanded, "C" for all\n')
if version == 'A' or 'a':
	print('You choosed the minimum version')

	print('What is the token of the bot?')
	token = input()
	print('What prefix should the bot have?')
	prefix = input()
	print('Owner ID?')
	ownerID = input()
	print('Bot ID?')
	botID = input()

	data = {'token': token, 'prefix': [ prefix ], 'ownerID': ownerID, 'botID': botID}
	with open("config.json", "w") as outfile:
		json.dump(data, outfile)
	quit()

if version == 'B' or 'b':
	print('You choosed the recommanded version')

	print('What is the token of the bot?')
	token = input()
	print('What prefix should the bot have?')
	prefix = input()
	print('Owner ID?')
	ownerID = input()
	print('bot ID?')
	botID = input()
	print('channel ID for where the bot will post its stats')
	statsChannel = input()
	print('Invite to the support server')
	supportServer = input()
	print('Channel ID for where the feedback will go')
	feedbackChannel = input()

	data = {'token': token, 'prefix': [ prefix ], 'ownerID': ownerID, 'botID': botID, 'statsChannel': statsChannel, 'supportServer': supportServer, 'feedbackChannel': feedbackChannel}
	with open("config.json", "w") as outfile:
		json.dump(data, outfile)
	quit()
	
if version == 'C' or 'c':
	print('You choosed the full version')

	print('What is the token of the bot?')
	token = input()
	print('What prefix should the bot have?')
	prefix = input()
	print('Owner ID?')
	ownerID = input()
	print('bot ID?')
	botID = input()
	print('channel ID for where the bot will post its stats')
	statsChannel = input()
	print('Invite to the support server')
	supportServer = input()
	print('Channel ID for where the feedback will go')
	feedbackChannel = input()
	print('Facebook email (for the download command)')
	fbuser = input()
	print('Facebook password (for the download command)')
	fbpasswd = input()
	print('yandexAPI key (for the translate command)')
	yandexAPI = input()
	print('acoustID api key (for the music match command)')
	acoustID = input()
	print('Twitter consumer key (for the twitter command)')
	twiConsumer = input()
	print('Twitter consumer sercret key (for the twitter command)')
	twiConsumerSecret = input()
	print('Twitter token key (for the twitter command)')
	twiToken = input()
	print('Twitter token secret key (for the twitter command)')
	twiTokenSecret = input()


	data = {'token': token, 'prefix': [ prefix ], 'ownerID': ownerID, 'botID': botID, 'statsChannel': statsChannel, 'supportServer': supportServer, 'feedbackChannel': feedbackChannel, 'fbuser': fbuser, 'fbpasswd': fbpasswd, 'yandexAPI': yandexAPI, 'acoustID': acoustID, 'twiConsumer': twiConsumer, 'twiConsumerSecret': twiConsumerSecret, 'twiToken': twiToken, 'twiTokenSecret': twiTokenSecret}
	with open("config.json", "w") as outfile:
		json.dump(data, outfile)
	quit()
