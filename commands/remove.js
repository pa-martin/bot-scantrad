module.exports.run = async (client, message, args, functions) => {
    functions.hasRight(message);
    message.delete();
    const fs = require('fs');

    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./remove manga.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "anime":
        try {
            let commandFile = require(`./remove anime.js`);
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