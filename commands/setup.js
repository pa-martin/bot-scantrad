module.exports.run = async (client, message, args, functions) => {
    message.delete();
    if(!functions.hasRight(message)) return;
    
    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./setup manga.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "anime":
            try {
                let commandFile = require(`./setup anime.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        default:
            const mangaButton = functions.createButton('mangaSetup', 'Manga', 'PRIMARY');
            const animeButton = functions.createButton('animeSetup', 'Anime', 'PRIMARY');
            message.channel.send({content: `Plutôt manga ou anime ?`, components: [mangaButton, animeButton] });
            break;
    }
}