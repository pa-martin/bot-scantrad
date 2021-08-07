module.exports.run = async (client, message, args, functions, buttons) => {
    const fetch = require('node-fetch');
    const RSS_URL = "http://www.mavanimes.co/feed/";

    fetch(RSS_URL)
    .then(response => response.text())
    .then(data => {
        let titres = data.match(/<title>.*<\/title>/g), manga = [];
        titres.shift();
        titres.shift();

        for(let i=0; i<titres.length; i++) {
            titres[i] = titres[i].replace("<title>","").replace("</title>", "");
            let titre = titres[i].replace(/ [0-9]+ VOSTFR/g,""), chap = titres[i].match(/ [0-9]+ VOSTFR/g)[0].replace(/ |VOSTFR/g, "");
            titres[i] = [titre,chap];

            let already = false;
            for(let i=0; i<manga.length; i++){
                if(titre == manga[i]) already = true;
            }
            if(!already) manga[manga.length] = titre;
        }

        let text = `Voici les 5 derniers épisodes sortis :\n\`\`\``;
        for(let i=0; i<5; i++) {
            text += `${i}: ${titres[i][0]} (${titres[i][1]})\n`
        }
        text += "```";

        message.channel.send(text);
    });
}