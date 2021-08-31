const fs = require("fs");
module.exports.run = async (client, message, args, functions) => {
    const fs = require("fs");
    const fetch = require('node-fetch');
    const RSS_URL = "https://scantrad.net/rss/";

    if(!fs.existsSync(`./dms/${message.member.id}/`)) {
        await functions.createDmsFolder(message);
        message.channel.send({content:`Ton dossier a été crée dans la base de données.`}).then(m => { setTimeout(function () { m.delete()} , 15*1000) });
    }

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
        message.channel.send(text).then(m => { setTimeout(async function () { m.delete()} , 15*1000) });

        message.channel.awaitMessages({filter:(m => m.member.id === message.member.id), max: 1, time: 15000})
        .then(collected => {
            let m = collected.first();
            m.delete();
            if(!m.content.match(/^-?[0-9]+$/)) { m.channel.send(`Merci d'entrer un nombre !`).then(m => { setTimeout(function () { m.delete()} , 5*1000) }); return; }
            if(m.content < 0 || m.content > (manga.length-1)) { m.channel.send("Le choix n'est pas dans la liste !").then(m => { setTimeout(function () { m.delete()} , 5*1000) });  return; }

            if(fs.existsSync(`./dms/${m.member.id}/manga/${manga[m.content]}.json`)) { m.channel.send(`Le manga ${manga[m.content]} à déjà été ajouté ! (\`!dm setup manga ${manga[m.content]}\`)`).then(m => { setTimeout(function () { if(!m.deleted) { m.delete(); }} , 5*1000) }); return; }
            data = {
                "dernierChap": null,
                "lienChap": null
            }
            fs.writeFile(`./dms/${m.member.id}/manga/${manga[m.content]}.json`, JSON.stringify(data), (err) => {
                if(err) console.log(functions.time("ERROR") + err);
                else {
                    console.log(`${functions.time("INFO")} Le manga ${manga[m.content]} à été ajouté pour le membre ${m.member.displayName}.`);
                    const button = functions.createButton(`dm setup manga.${manga[m.content]}`,"Click ici pour setup","PRIMARY");
                    m.channel.send({content:`Le manga ${manga[m.content]} à bien été ajouté ! Setup les annonces avec la commande \`!dm setup manga ${manga[m.content]}\`.`, components:[button]});
                    require(`./refresh.js`).run(client, message, ["true"], functions);
                }
            });
        }).catch((err) => {
            if(err) console.log(functions.time("ERROR") + err);
            console.log(err);
            message.channel.send({content:'Temps écoulé. ⌛'}).then(m => { setTimeout(function () { m.delete()} , 5*1000) });
        });
    })
    .catch(err => {
        console.log(err)
    });
}