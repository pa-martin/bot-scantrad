module.exports.run = async (client, message, args, functions) => {
    message.delete();

    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./get manga.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "anime":
            try {
                let commandFile = require(`./get anime.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        default:
            const mangaButton = functions.createButton('mangaGet', 'Manga', 'PRIMARY');
            const animeButton = functions.createButton('animeGet', 'Anime', 'PRIMARY');
            message.channel.send({content: `Plutôt manga ou anime ?`, components: [mangaButton, animeButton] });
            break;
    }
}