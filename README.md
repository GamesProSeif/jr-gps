# Jr. GPS Discord Bot

## Description

This is a private bot that allows the user to make ranks and a lot of stuff. It also has some moderation commands, and also a point system ready for you!

## Adding the bot to the server

If you want the bot to join your server, I'm sorry... It's a private bot, so it will only work on the server it's on. You still make a new bot and change the inner `app.js` file.
First go to [Discord Developer website](https://discordapp.com/developers/).
Then make a new application. Choose the name of your bot and the picture, then go to the *Bot* section under *SETTINGS* and make the application a bot.
Next, go to *OAuth2* section under *SETTINGS* and Check the *bot* option under *SCOPES*.
After that, check the *Administrator* option under *BOT PERMISSIONS*, then copy the link given under *SCOPES*, and paste it in a new window in your browser.
This should add the bot to your server.
Next, you have to install `node.js` from [Node.js](https://nodejs.org/en/), and set it up.
(This process should be long and will cause your device to reboot multiple times)
After that, you can download the repository from GitHub to your device.
You might also want to get a text editor. If you don't have one, I recommend [Atom](https://atom.io/), simply because it allows you to use GitHub features within the application.
After that, open the folder containing the repository files, Shift + right click in any empty area, then click *Open PowerShell window here*, you can also use the *Command Prompt*, but I'm trying to make this as easy as possible.
Next, type `npm install` to install all dependencies required for the bot.
After that, hop in your text editor and edit the first few lines of the bot, the ones that have the `process.env` in it. Replace them with your own data, a comment is beside each of these lines.
After that, you can finally host your bot and make it run by typing `node app.js` in the *PowerShell* you opened before, and that's all.

## Available commands

### User commands
1. Help
2. Ping
3. Version
4. Repository
5. User-info
6. Verify
7. Sp
8. Ss
9. Server
10. Levelup

### Admin commands
1. Say
2. Bc
3. Point
4. Ban-word
5. Rank
6. Mute
7. Tempmute
8. Unmute
9. Kick
10. Ban

### Owner commands
1. Deletemsg
2. Prefix-set

### Developer commands
1. Sendfile

## Extra details
Pull requests are open, I'd like to have your suggestions.
Thank you, that's all. I hope you enjoy it.
