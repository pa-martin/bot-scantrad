module.exports.run = async (client, message, args, functions) => {
    message.delete();
    functions.hasRight(message);

    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./serveur/remove manga.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "anime":
        try {
            let commandFile = require(`./serveur/remove anime.js`);
            args.shift();
            commandFile.run(client, message, args, functions);
        } catch (err) {}
        break;
        default:
            const mangaButton = functions.createButton('mangaRemove', 'Manga', 'PRIMARY');
            const animeButton = functions.createButton('animeRemove', 'Anime', 'PRIMARY');
            message.channel.send({content: `Plutôt manga ou anime ?`, components: [mangaButton, animeButton] });
            break;
    }
}