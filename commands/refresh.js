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
            manga[i] = manga[i].replace("<title><![CDATA[Scan - ","").replace("]]></title>", "");
            manga[i] = [manga[i].replace(/( Chapitre [0-9]+)/g,""), manga[i].match(/(Chapitre ([0-9])+)/g)[0].replace("Chapitre ", "")];
            titres[i] = manga[i][0];
        }

        let directoryPath = require('path').join(`./servers`, message.guild.id), files = [];
        fs.readdir(directoryPath, function (err, result) {
            if (err) {
                return console.log(`${functions.time(ERROR)} Imposible d'accéder au dossier !`);
            }
            result.forEach(function (file) {
                files.push(file.replace(".json", ""));
            });
            files.forEach(file => {
                try {
                    let data = JSON.parse(fs.readFileSync(`./servers/${message.guild.id}/${file}.json`));
                    data.dernierChap = manga[titres.indexOf(file)][1];

                    fs.writeFile(`./servers/${message.guild.id}/${file}.json`, JSON.stringify(data), (err) => {
                        if(err) console.log(functions.time("ERROR") + err);
                    });
                }catch(err){
                    console.log(err);
                }
            });
            console.log(`${functions.time("INFO")} Un refresh a été effectué sur le serveur "${message.guild.name}".`);
            message.channel.send(`Refresh terminé !`);
        });
    });
}