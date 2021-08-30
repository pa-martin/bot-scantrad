module.exports.run = async (client, message, args, functions) => {
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

        let directoryPath = require('path').join(`./dms/${message.member.id}/`, "manga"), files = [];
        fs.readdir(directoryPath, function (err, result) {
            if (err) {
                return console.log(`${functions.time(ERROR)} Imposible d'accéder au dossier !`);
            }
            result.forEach(function (file) {
                files.push(file.replace(".json", ""));
            });
            files.forEach(file => {
                try {
                    let data = JSON.parse(fs.readFileSync(`./dms/${message.member.id}/manga/${file}.json`));
                    if(titres.indexOf(file) == -1) return;   // évite les erreurs s'il n'y a pas de chapitre récent (pas dans la liste des chaps)
                    data.dernierChap = manga[titres.indexOf(file)][1];

                    fs.writeFile(`./dms/${message.member.id}/manga/${file}.json`, JSON.stringify(data), (err) => {
                        if(err) console.log(functions.time("ERROR") + err);
                    });
                }catch(err){
                    console.log(err);
                }
            });
            if(args[0] != "true") console.log(`${functions.time("INFO")} Un refresh a été effectué pour le membre "${message.member.displayName}".`);
            if(args[0] != "true") message.channel.send(`Refresh terminé !`).then(m => { setTimeout(function () { m.delete()} , 5*1000) });;
        });
    })
    .catch(err => console.log(err));
}