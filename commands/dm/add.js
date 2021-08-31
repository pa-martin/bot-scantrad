module.exports.run = async (client, message, args, functions) => {
    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./add manga.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        default:
            const mangaButton = functions.createButton('dm/add manga', 'Manga', 'PRIMARY');
            const animeButton = functions.createButton('dm/add anime', 'Anime', 'PRIMARY');
            message.channel.send({content: `Plutôt manga ou anime ?`, components: [mangaButton, animeButton] });
            break;
    }
}