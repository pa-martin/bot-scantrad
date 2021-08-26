module.exports.run = async (client, message, args, functions) => {
    message.delete();
    const fs = require('fs');
    client.guilds.cache.forEach(guild => {
        let directoryPath = require('path').join(`./servers/${guild.id}/`, "manga"), files = [];
        fs.readdir(directoryPath, function (err, result) {
            if (err) {
                return console.log(`${functions.time("ERROR")} Imposible d'accéder au dossier "manga" du serveur ${guild.name} !`);
            }
            result.forEach(function (file) {
                files.push(file.replace(".json", ""));
            });
            files.forEach(file => {
                try {
                    let data = JSON.parse(fs.readFileSync(`./servers/${guild.id}/manga/${file}.json`));

                    data = {
                        "dernierChap": data.dernierChap,
                        "channelID": data.channelID,
                        "lienChap": data.lienChap,
                        "msgID": null
                    }

                    fs.writeFile(`./servers/${guild.id}/manga/${file}.json`, JSON.stringify(data), (err) => {
                        if(err) console.log(functions.time("ERROR") + err);
                    });
                }catch(err){
                    console.log(err);
                }
            });
        });
    });
}