const fs = require("fs");
module.exports = class pamlol {
    constructor(client, Discord) {
        this.client = client;
        this.Discord = Discord;
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

        if(!arg) { message.channel.send(`Cette commande requiert un argument d'entrée.`).then(m => { setTimeout(function () { m.delete()} , 5*1000) }); return -1; }
        else if(arg.startsWith("<@!")) userId = arg.substring(0,arg.indexOf(">")).slice(3);
        else if(arg.startsWith("<@")) userId = arg.substring(0,arg.indexOf(">")).slice(2);
        else userId = arg;

        if(!this.client.guilds.cache.get(message.guild.id).members.cache.get(arg)) {
            message.channel.send(`Merci de citer un joueur présent sur le serveur.`).then(m => { setTimeout(function () { m.delete()} , 5*1000) });
            return -1;
        }

        return userId;
    }
    update(functions) {
        const fs = require('fs');
        const fetch = require('node-fetch');
        const RSS_URL = "https://scantrad.net/rss/";
    
        fetch(RSS_URL)
        .then(response => response.text())
        .then(data => {
            let manga = data.match(/<title>.*<\/title>/g), titres = [];
            manga.shift();
    
            for(let i=0; i<manga.length; i++) {
                manga[i] = manga[i].replace("<title><![CDATA[Scan - ","").replace("]]></title>", "").replace(":","-");
                manga[i] = [manga[i].replace(/( Chapitre ([0-9]|\.)+)/g,""), manga[i].match(/(Chapitre ([0-9]|\.)+)/g)[0].replace("Chapitre ", "")];
                titres[i] = manga[i][0];
            }
    
            this.client.guilds.cache.forEach(guild => {
                let directoryPath = require('path').join(`./servers/${guild.id}/`, "manga"), files = [];
                fs.readdir(directoryPath, function (err, result) {
                    if (err) {
                        return console.log(`${functions.time("ERROR")} Imposible d'accéder au dossier "manga" du serveur ${guild.name} !`);
                    }
                    result.forEach(function (file) {
                        files.push(file.replace(".json", ""));
                    });
                    files.forEach(file => {
                        try {
                            let data = JSON.parse(fs.readFileSync(`./servers/${guild.id}/manga/${file}.json`));
                            if(!(data.dernierChap != null && data.channelID != null && manga[titres.indexOf(file)] != undefined)) return;
                            // else if(titres.indexOf(file) == -1) { console.log(`Pas de chapitre récent de ${file}.`); return; }
                            else if(data.dernierChap === manga[titres.indexOf(file)][1]) return;
        
                            data.dernierChap = manga[titres.indexOf(file)][1];
                            if(data.msgID != null) guild.channels.cache.get(data.channelID).messages.fetch(data.msgID).then(m => m.delete());
                            guild.channels.cache.get(data.channelID).send({content: `Oyé, Oye, un nouveau chapitre de ${file} vient de sortir (le ${parseInt(data.dernierChap)}) :\n${data.lienChap}${data.dernierChap}`}).then(m => {
                                data.msgID = m.id;

                                fs.writeFile(`./servers/${guild.id}/manga/${file}.json`, JSON.stringify(data), (err) => {
                                    if(err) console.log(functions.time("ERROR") + err);
                                });
                            });
                        }catch(err){
                            console.log(err);
                        }
                    });
                });
            });
            let client = this.client;

            // let directoryPath = require('path').join(`./dms/${guild.id}/`, "manga"), files = [];
            fs.readdir(require('path').join('./dms', ''), function (err, result) {
                result.forEach(function (folder) {
                    fs.readdir(require('path').join(`./dms/${folder}/`, 'manga'), function (err, result2) {
                        result2.forEach(file => {
                            try {
                                file = file.replace('.json', '');
                                let data = JSON.parse(fs.readFileSync(`./dms/${folder}/manga/${file}.json`));
                                if(!(data.dernierChap != null && manga[titres.indexOf(file)] != undefined)) return;
                                // else if(titres.indexOf(file) == -1) { console.log(`Pas de chapitre récent de ${file}.`); return; }
                                else if(data.dernierChap === manga[titres.indexOf(file)][1]) return;

                                data.dernierChap = manga[titres.indexOf(file)][1];
                                if(data.msgID != null) client.users.cache.get(folder).dmChannel.messages.fetch(data.msgID).then(m => m.delete());
                                client.users.fetch(folder).then(u => u.send({content: `Oyé, Oye, un nouveau chapitre de ${file} vient de sortir (le ${parseInt(data.dernierChap)}) :\n${data.lienChap}${data.dernierChap}`}).then(m => {
                                    data.msgID = m.id;

                                    fs.writeFile(`./dms/${folder}/manga/${file}.json`, JSON.stringify(data), (err) => {
                                        if(err) console.log(functions.time("ERROR") + err);
                                    });
                                }));
                            }catch(err){
                                console.log(err);
                            }
                        });
                    });
                });
            });
        })
        .catch(err => {
            if(err.message.includes("request to https://scantrad.net/rss/ failed, reason: connect ETIMEDOUT 185.178.208.176:443")) console.log("erreur de réponse");
            // else if(err.code = 'ENOTFOUND') console.log('erreur de connexion')
            else if(err.message.includes("request to https://scantrad.net/rss/ failed, reason: self signed certificate")) console.log("erreur de certificat");
            else console.log(err);
        });
    }
    activityMove(delay) {
        /* delay en secondes */
        const date = new Date();

        switch (date.getSeconds()%20*delay < delay) {
            case true:
                this.client.user.setActivity("!add manga", {type: 'COMPETING'});
                break;
            case false:
                this.client.user.setActivity(`@pam#6088`, { type: 'WATCHING'});
                break;
        }
    }
    hasRight(message) {
        if(message.member.id == "217200239264661504" || message.guild.member(message.author).hasPermission('ADMINISTRATOR')) return true;
        message.channel.send(`Tu n'as pas les autorisations nécessaires.`).then(m => { setTimeout(function () { m.delete()} , 5*1000) });
        return false;
    }
    async buttonClick(interaction) {
        interaction.deferUpdate();
        interaction.deleteReply();
        if(interaction.customId.includes('anime')) interaction.channel.send("Désolé, la partie anime n'est pas encore prête.").then(m => { setTimeout(function () { m.delete()} , 5*1000) });
        else if(interaction.customId.startsWith('mangaSetup.')) require(`./commands/setup manga.js`).run(this.client, interaction, interaction.customId.replace("mangaSetup.","").split(" "), this);
        else if(interaction.customId === 'mangaSetup') this.getUnsetup(interaction, 'manga');
        else if(interaction.customId.startsWith('dm setup manga.')) require(`./commands/dm setup manga.js`).run(this.client, interaction, interaction.customId.replace("dm setup manga.","").split(" "), this);
        else if(interaction.customId.startsWith('dm')) require(`./commands/${interaction.customId}.js`).run(this.client, interaction, [], this);
        else if(interaction.customId.includes('manga')) require(`./commands/${interaction.customId.replace("manga","").toLowerCase()} manga.js`).run(this.client, interaction, [], this);
        else if(interaction.customId === '') return;
    }
    createButton(id, label, style) {
        return new this.Discord.MessageActionRow()
		.addComponents(
            new this.Discord.MessageButton()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
        );
    }   
    createLinkButton(url, label) {
        return new this.Discord.MessageActionRow()
		.addComponents(
            new this.Discord.MessageButton()
            .setURL(url)
            .setLabel(label)
            .setStyle('LINK')
        );
    }
    getUnsetup(message, type) {
        let elClient = this.client;
        const fs = require('fs');
        if(type != "manga" && type != "anime") return;

        let directoryPath = require('path').join(`./servers/${message.guild.id}/`, type), files = [];
        fs.readdir(directoryPath, function (err, result) {
            if (err) {
                return console.log(`${functions.time(ERROR)} Imposible d'accéder au dossier !`);
            }
            let text = '```diff\n';
            result.forEach(function (file) {
                try {
                    const data = JSON.parse(fs.readFileSync(`./servers/${message.guild.id}/manga/${file}`));
                    const testChan = data.channelID === "" || data.channelID === null;
                    const testLink = data.lienChap === "" || data.lienChap === null;
                    
                    if(testChan || testChan) {
                        text += `+ ${file.replace('.json','')} (n°${files.length+1})\n-  `;
                    
                        if(testChan && testLink) text += "n'a rien de défini\n";
                        else if(testChan) text += "n'a pas de channel défini\n";
                        else if(testLink) text += "n'a pas de lien défini\n";

                        files.push(file.replace(".json", ""));
                    }
                }catch(err){
                    console.log(err);
                }
            });
            if(text.endsWith('```diff\n')) text += "+ Tous les mangas sont bien configurés !";
            text += '```';

            message.channel.send(text)
            .then(m => { setTimeout( async function () { m.delete()} , 10*1000) });
            message.channel.awaitMessages({filter:(m => m.member.id === message.member.id), max: 1, time: 30*1000})
            .then(collected => {
                let m = collected.first();
                if(!m.content.match(/^[0-9]+$/g)) { m.channel.send("Merci d'entrer le nombre correspondant au manga que tu souhaites configurer.").then(m => { setTimeout(async function () { m.delete()} , 3*1000) }); m.delete(); return; }
                if(parseInt(m.content) < 1 || parseInt(m.content) > files.length) { m.channel.send({content:"Merci d'entrer un nombre présent dans la liste."}).then(m => { setTimeout(async function () { m.delete()} , 3*1000) }); m.delete(); return; }
                m.delete();
                require(`./commands/setup manga.js`).run(elClient, message, files[parseInt(m.content)-1].split(' '), this);
            });
        });
    }
    async createDmsFolder(message) {
        fs.mkdirSync(require('path').join(`./dms/`, message.member.id), (err) => {
            if (err) {
                return console.log(`${functions.time("ERROR")} Impossible de créer le dossier principal pour le membre ${m.member.displayName} (id : ${m.member.id}).`);
                ;
            }
        });
        fs.mkdirSync(require('path').join(`./dms/${message.member.id}/`, "manga"), (err) => {
            if (err) {
                return console.log(`${functions.time("ERROR")} Impossible de créer le dossier "manga" pour le membre ${m.member.displayName} (id : ${m.member.id}).`);;
            }
        });
        return fs.mkdirSync(require('path').join(`./dms/${message.member.id}/`, "anime"), (err) => {
            if (err) {
                return console.log(`${functions.time("ERROR")} Impossible de créer le dossier "anime" pour le membre ${m.member.displayName} (id : ${m.member.id}).`);;
            }
        });
    }
}