module.exports = class pamlol {
    constructor(client) {
        this.client = client;
    }
    // Time en ms
    sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    time(type) {
        const colors = require('colors');
        const date = new Date();
        let hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();

        if(hours < 10) hours = '0' + hours;
        if(minutes < 10) minutes = '0' + minutes;
        if(seconds < 10) seconds = '0' + seconds;

        switch (type) {
            case "ERROR":
                return (`[${hours}:${minutes}:${seconds} ${type}]:`).red;
            case "WARNING":
                return (`[${hours}:${minutes}:${seconds} ${type}]:`).yellow;
            case "INFO":
                return (`[${hours}:${minutes}:${seconds} ${type}]:`).green;
            case undefined:
                return (`[${hours}:${minutes}:${seconds}]:`).gray;
            default:
                return (`[${hours}:${minutes}:${seconds} ${type}]:`).cyan;
        }
        
    }
    checkMp(message) {
        return message.channel.type === 'dm';
    }
    getUserId(arg, message) {
        let userId;

        if(!arg) { message.channel.send(`Rentre un args stp.`); return -1; }
        else if(arg.startsWith("<@!")) userId = arg.substring(0,arg.indexOf(">")).slice(3);
        else if(arg.startsWith("<@")) userId = arg.substring(0,arg.indexOf(">")).slice(2);
        else userId = arg;

        if(!this.client.guilds.cache.get(message.guild.id).members.cache.get(arg)) {
            message.channel.send(`Merci de citer un joueur présent sur le serveur.`)
            return -1;
        }

        return userId;
    }
    update() {
        const fs = require('fs');
        const fetch = require('node-fetch');
        const RSS_URL = "https://scantrad.net/rss/";
    
        fetch(RSS_URL)
        .then(response => response.text())
        .then(data => {
            let manga = data.match(/<title>.*<\/title>/g), titres = [];
            manga.shift();
    
            for(let i=0; i<manga.length; i++) {
                manga[i] = manga[i].replace("<title><![CDATA[Scan - ","").replace("]]></title>", "");
                manga[i] = [manga[i].replace(/( Chapitre [0-9]+)/g,""), manga[i].match(/(Chapitre ([0-9])+)/g)[0].replace("Chapitre ", "")];
                titres[i] = manga[i][0];
            }
    
            this.client.guilds.cache.forEach(guild => {
                let directoryPath = require('path').join(`./servers`, guild.id), files = [];
                fs.readdir(directoryPath, function (err, result) {
                    if (err) {
                        return console.log(`${functions.time(ERROR)} Imposible d'accéder au dossier !`);
                    }
                    result.forEach(function (file) {
                        files.push(file.replace(".json", ""));
                    });
                    files.forEach(file => {
                        try {
                            let data = JSON.parse(fs.readFileSync(`./servers/${guild.id}/${file}.json`));
                            if(!(data.dernierChap != null && data.channelID != null && manga[titres.indexOf(file)][1])) return;
                            if(data.dernierChap === manga[titres.indexOf(file)][1]) return;
        
                            data.dernierChap = manga[titres.indexOf(file)][1];
                            guild.channels.cache.get(data.channelID).send(`Oyé, Oye, un nouveau chapitre de ${file} vient de sortir (le ${parseInt(data.dernierChap)}) :\n${data.lienChap}${data.dernierChap}`);

                            fs.writeFile(`./servers/${guild.id}/${file}.json`, JSON.stringify(data), (err) => {
                                if(err) console.log(functions.time("ERROR") + err);
                            });
                        }catch(err){
                            console.log(err);
                        }
                    });
                });
            });
        });
    }
    activityMove(delay) {
        /* delay en secondes */
        const date = new Date();

        switch (date.getSeconds()%20*delay < delay) {
            case true:
                this.client.user.setActivity("!add manga", {type: 'WATCHING'}).catch(console.error);
                break;
            case false:
                this.client.user.setActivity(`@pam#6088`, { type: 'WATCHING'}).catch(console.error);
                break;
        }
    }
    hasRight(message) {
        if(message.author.id == "217200239264661504" || message.guild.member(message.author).hasPermission('ADMINISTRATOR')) return true;
        message.reply(`T'as pas les droits mskn.`)
        return false;
    }
}