module.exports.run = async (client, message, functions, args) => {
    const fetch = require('node-fetch');
    const RSS_URL = "https://scantrad.net/rss/";

    fetch(RSS_URL)
    .then(response => response.text())
    .then(data => {
        let titres = data.match(/<title>.*<\/title>/g);
        titres.shift();

        for(let i=0; i<titres.length; i++) {
            titres[i] = titres[i].replace("<title><![CDATA[Scan - ","").replace("]]></title>", "");
            titres[i] = [titres[i].replace(/( Chapitre [0-9]+)/g,""),titres[i].match(/(Chapitre ([0-9])+)/g)[0].replace("Chapitre ", "")];
        }

        let text = `Voici les 5 derniers chapitres sortis :\n\`\`\``;
        for(let i=0; i<5; i++) {
            text += `${i}: ${titres[i][0]} (${titres[i][1]})\n`
        }
        text += "```";
        
        message.channel.send(text);
    });
}