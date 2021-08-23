module.exports.run = async (client, message, args, functions) => {
    const fs = require('fs');

    if(!args[0]) { 
        message.channel.send(`Quel manga souhaites-tu supprimer ? (\`!list manga\` pour avoir la liste des mangas)`)
        .then( m => setTimeout(function(){ m.delete() }, 10*1000) );
        message.channel.awaitMessages({filter:(m => m.member.id === message.member.id), max: 1, time: 10*1000})
        .then(collected => {
            let m = collected.first();
            m.delete();
            try{
                fs.unlinkSync((`./servers/${message.guild.id}/manga/${m.content}.json`));
                message.channel.send(`Le manga ${m.content} a bien été supprimé du serveur.`).then( m => setTimeout(function(){ m.delete() }, 5000) );
                console.log(`${functions.time("INFO")} Le manga ${m.content} a été supprimé pour le serveur ${message.guild.name}.`);
            } catch(err) {
                if(err.message.includes('no such file or directory')) message.channel.send(`Le manga ${m.content} n'a pas été ajouté pour ce serveur.`).then( m => setTimeout(function(){ m.delete() }, 5000) );
                else console.log(`${functions.time("ERROR")} Echec à la suppression du manga ${m.content} pour le serveur ${message.guild.name}.`);
            }
        })
        .catch((err) => {
            message.reply('Temps écoulé. ⌛');
            if(err) console.log(functions.time("ERROR") + err);
        });
    } else {
        try{
            fs.unlinkSync((`./servers/${message.guild.id}/manga/${args.join(" ")}.json`));
            message.channel.send(`Le manga ${args.join(' ')} a bien été supprimé du serveur.`).then( m => setTimeout(function(){ m.delete() }, 5000) );
            console.log(`${functions.time("INFO")} Le manga ${args.join(' ')} a été supprimé pour le serveur ${message.guild.name}.`);
        } catch(err) {
            if(err.message.includes('no such file or directory')) message.channel.send(`Le manga ${args.join(' ')} n'a pas été ajouté pour ce serveur.`).then( m => setTimeout(function(){ m.delete() }, 5000) );
            else console.log(`${functions.time("ERROR")} Echec à la suppression du manga ${args.join(' ')} pour le serveur ${message.guild.name}.`);
        }
    }
}