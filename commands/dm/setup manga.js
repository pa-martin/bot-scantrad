module.exports.run = async (client, message, args, functions) => {
    const fs = require('fs');
    if(!args[0]) { message.channel.send(`Merci de renseigner le nom du manga à setup en paramètre.`).then(m => { setTimeout(function () { m.delete()} , 5*1000) }); return; }

    fs.readdir(require('path').join(`./dms/${message.member.id}/`, "manga"), function (err, result) {
        if (err) {
            return console.log(`${functions.time(ERROR)} Imposible d'accéder au dossier !`);
        }
        if(!result.includes(`${args.join(" ")}.json`)) { message.channel.send(`Merci de renseigner un nom de manga précédemment ajouté avec la commande \`!dm add manga\`.`).then(m => { setTimeout(function () { m.delete()} , 5*1000) }); return; }
        message.channel.send(`Setup de ${args.join(" ")}...\nT'as un petit lien pour les chapitres bg ?`).then(m => { setTimeout(function () { m.delete()} , 30*1000) });
        message.channel.awaitMessages({filter:(m => m.member.id === message.member.id), max: 1, time: 30*1000})
        .then(collected => {
            let m = collected.first();
            m.delete();
            if(!m.content.startsWith("https://scantrad.net/mangas/")) { m.channel.send(`T'es sûr de ton lien bg ? (${m.content})\nIl ne correspond à la norme (https://scantrad.net/mangas/).`).then(m => { setTimeout(function () { m.delete()} , 10*1000) }); return; }
           
            let data = JSON.parse(fs.readFileSync(`./dms/${message.member.id}/manga/${args.join(" ")}.json`));
            data.lienChap = m.content.replace(/(([0-9]|\.)+#?[0-9]*)$/g, "");
            
            fs.writeFile(`./dms/${message.member.id}/manga/${args.join(" ")}.json`, JSON.stringify(data), (err) => {
                if(err) console.log(functions.time("ERROR") + err);
            });
            message.channel.send(`Oki parfait, le lien a bien été ajouté.`).then(m => { setTimeout(function () { m.delete()} , 10*1000) });

        }).catch((err) => {
            message.channel.send('Temps écoulé. ⌛').then(m => { setTimeout(function () { m.delete()} , 5*1000) });
            if(!err.stack.includes("TypeError: Cannot read property 'content' of undefined")) console.log(`${functions.time("ERROR")} ${err}`);
        });

    });
}