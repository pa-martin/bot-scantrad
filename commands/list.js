module.exports.run = async (client, message, args, functions) => {
    message.delete();
    
    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./list manga.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "anime":
        try {
            let commandFile = require(`./list anime.js`);
            args.shift();
            commandFile.run(client, message, args, functions);
        } catch (err) {}
        break;
        default:
            const mangaButton = functions.createButton('mangaList', 'Manga', 'PRIMARY');
            const animeButton = functions.createButton('animeList', 'Anime', 'PRIMARY');
            message.channel.send({content: `Plutôt manga ou anime ?`, components: [mangaButton, animeButton] });
            break;
    }
}