module.exports.run = async (client, message, args, functions) => {
    const fs = require('fs');
    if(!args[0]) { message.channel.send(`Merci de renseigner le nom du manga à setup en paramètre.`); return; }

    fs.readdir(require('path').join(`./servers/${message.guild.id}/`, "manga"), function (err, result) {
        if (err) {
            return console.log(`${functions.time(ERROR)} Imposible d'accéder au dossier !`);
        }
        if(!result.includes(`${args.join(" ")}.json`)) { message.channel.send(`Merci de renseigner un nom de manga précédemment ajouté avec la commande \`!add manga\`.`); return; }
        message.channel.send(`Setup de ${args.join(" ")}...\nT'as un petit lien pour les chapitres bg ?`);
        message.channel.awaitMessages({filter:(m => m.member.id === message.member.id), max: 1, time: 30000})
        .then(collected => {
            let m = collected.first();
            if(!m.content.startsWith("https://scantrad.net/mangas/")) { m.channel.send(`T'es sûr de ton lien bg ? (${m.content})\nIl ne correspond à la norme (https://scantrad.net/mangas/).`); return; }
           
            let data = JSON.parse(fs.readFileSync(`./servers/${message.guild.id}/manga/${args.join(" ")}.json`));
            data.lienChap = m.content.replace(/(([0-9]|\.)+#?[0-9]*)$/g, "");
            
            fs.writeFile(`./servers/${message.guild.id}/manga/${args.join(" ")}.json`, JSON.stringify(data), (err) => {
                if(err) console.log(functions.time("ERROR") + err);
            });
            message.channel.send(`Oki parfait, le lien a bien été ajouté. T'as pas un petit channel pour annoncer les derniers chap stp ?`);
            
            message.channel.awaitMessages({filter:(m => m.member.id === message.member.id), max: 1, time: 30000})
            .then(collected => {
                let m = collected.first();
                if(!m.content.match(/(^<#[0-9]+>$)|(^[0-9]+$)/g)) { m.channel.send(`Merci de rentrer un channel.`); return; }
                data.channelID = m.content.replace(/<|>|#/g, "");
                fs.writeFile(`./servers/${message.guild.id}/manga/${args.join(" ")}.json`, JSON.stringify(data), (err) => {
                    if(err) console.log(functions.time("ERROR") + err);
                });
                message.channel.send(`Oki tout est noté ! Merci bg ;)`);
                
            }).catch((err) => {
                message.reply('Temps écoulé. ⌛');
                if(!err.stack.includes("TypeError: Cannot read property 'content' of undefined")) console.log(`${functions.time("ERROR")} ${err}`);
            });

        }).catch((err) => {
            message.reply('Temps écoulé. ⌛');
            if(!err.stack.includes("TypeError: Cannot read property 'content' of undefined")) console.log(`${functions.time("ERROR")} ${err}`);
        });

    });
}