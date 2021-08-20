module.exports.run = async (client, message, args, functions) => {
    const fs = require("fs");
    const fetch = require('node-fetch');
    const RSS_URL = "https://scantrad.net/rss/";

    fetch(RSS_URL)
    .then(response => response.text())
    .then(data => {
        let titres = data.match(/<title>.*<\/title>/g), manga = [];
        titres.shift();

        for(let i=0; i<titres.length; i++) {
            titres[i] = titres[i].replace("<title><![CDATA[Scan - ","").replace("]]></title>", "").replace(/( Chapitre ([0-9]|\.)+)/g,"").replace(":","-");

            let already = false;
            for(let j=0; j<manga.length; j++){
                if(titres[i] == manga[j]) already = true;
            }
            if(!already) manga[manga.length] = titres[i];
        }

        let text = `Voici la liste des mangas disponible :\n\`\`\``;
        for(let i=0; i<manga.length; i++) {
            if(i<10) text += `0${i}: ${manga[i]}\n`
            else text += `${i}: ${manga[i]}\n`
        }
        text += "```";
        message.channel.send(text);

        message.channel.awaitMessages({filter:(m => m.member.id === message.member.id), max: 1, time: 30000})
        .then(collected => {
            let m = collected.first();
            if(!m.content.match(/^-?[0-9]+$/)) { m.channel.send(`Merci d'entrer un nombre !`); return; }
            if(m.content < 0 || m.content > (manga.length-1)) { m.channel.send("Le choix n'est pas dans la liste !");  return; }

            if(fs.existsSync(`./servers/${m.guild.id}/manga/${manga[m.content]}.json`)) { m.channel.send(`Le manga ${manga[m.content]} à déjà été ajouté ! (\`!setup manga ${manga[m.content]}\`)`); return; }
            data = {
                "dernierChap": null,
                "channelID": null,
                "lienChap": null
            }
            fs.writeFile(`./servers/${m.guild.id}/manga/${manga[m.content]}.json`, JSON.stringify(data), (err) => {
                if(err) console.log(functions.time("ERROR") + err);
                else {
                    console.log(`${functions.time("INFO")} Le manga ${manga[m.content]} à été ajouté pour le serveur ${m.guild.name}.`);
                    m.channel.send(`Le manga ${manga[m.content]} à bien été ajouté ! Setup les annonces avec la commande \`!setup manga ${manga[m.content]}\`.`);
                    require(`./refresh.js`).run(client, message, ["true"], functions);
                }
            });
        }).catch((err) => {
            message.reply('Temps écoulé. ⌛');
            if(err) console.log(functions.time("ERROR") + err);
        });
    })
    .catch(err => {
        console.log(err)
    });
}