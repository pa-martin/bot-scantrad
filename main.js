const Discord = require('discord.js');
const pamlol = require("./functions.js");
const config = require('./config.json');

const client = new Discord.Client();
const functions = new pamlol(client);

client.on('ready', () => {
    console.log(`${functions.time(`INFO`)} started`);
    functions.update();
    setInterval(async function(){ functions.activityMove(10); }, 10000);
    setInterval(async function(){ functions.update(); }, 60000);
});

client.on('message', message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;
	if(functions.checkMp(message)) return;
  
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args, functions);
    } catch (err) {}
});

client.on('guildCreate', guild => {
	const fs = require('fs');
	fs.mkdirSync(require('path').join(`${__dirname}/servers/`, guild.id), (err) => {
		if (err) {
			return console.log(`${functions.time("ERROR")} Impossible de créer le dossier pour le server ${guild.name} (id : ${guild.id}).`);;
		}
	});
});
client.on('guildDelete', guild => {
	const fs = require('fs');
	fs.rmdirSync(require('path').join(`${__dirname}/servers/`, guild.id), { recursive: true }, (err) => {
		if (err) {
			return console.log(`${functions.time("ERROR")} Impossible de supprimer le dossier pour le server ${guild.name} (id : ${guild.id}).`);;
		}
	});
});

client.login(config.token);
// https://discord.com/api/oauth2/authorize?client_id=847862252471189524&permissions=8&scope=bot