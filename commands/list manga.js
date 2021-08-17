module.exports.run = async (client, message, args, functions) => {
    const fs = require('fs');
    const directoryPath = require('path').join(`./servers/${message.guild.id}/`, "manga"), files = [];

    fs.readdir(directoryPath, function (err, result) {
        if (err) {
            return console.log(`${functions.time(ERROR)} Imposible d'accéder au dossier !`);
        }
        let text = `Voici, venu, la liste des mangas (pour ce serveur) : \`\`\`diff\n`
        result.forEach(function (file) {
            const infos = JSON.parse(fs.readFileSync(`./servers/${message.guild.id}/manga/${file}`));
            text += `+ ${file.replace(".json", "")}\n-   Chapitre ${infos.dernierChap}\n`; 
        });
        text += "```"
        message.channel.send(text);
    });
}