module.exports.run = async (client, message, args, functions) => {
    const fetch = require('node-fetch');
    const RSS_URL = "https://scantrad.net/rss/";

    fetch(RSS_URL)
    .then(response => response.text())
    .then(data => {
        let titres = data.match(/<title>.*<\/title>/g), manga = [];
        titres.shift();

        for(let i=0; i<titres.length; i++) {
            titres[i] = titres[i].replace("<title><![CDATA[Scan - ","").replace("]]></title>", "");
            let titre = titres[i].replace(/( Chapitre ([0-9]|\.)+)/g,""), chap = titres[i].match(/(Chapitre ([0-9]|\.)+)/g)[0].replace("Chapitre ", "");
            titres[i] = [titre,chap];

            let already = false;
            for(let i=0; i<manga.length; i++){
                if(titre == manga[i]) already = true;
            }
            if(!already) manga[manga.length] = titre;
        }

        let text = `Voici les 5 derniers chapitres sortis :\n\`\`\``;
        for(let i=0; i<5; i++) {
            text += `${i+1}: ${titres[i][0]} - Chapitre ${titres[i][1].replace(/^0*/,"")}\n`
        }
        text += "```";

        message.channel.send(text).then(m => { setTimeout(function () { m.delete()} , 10*1000) });
    });
}