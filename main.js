const Discord = require('discord.js');
const pamlol = require("./functions.js");
const config = require('./config.json');

const client = new Discord.Client();
const functions = new pamlol(client);

client.on('ready', () => {
    const time = functions.time(`INFO`);
    console.log(time + `started`);
});

client.on('message', message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
  
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args, functions);
    } catch (err) {}
});

client.login(config.token);