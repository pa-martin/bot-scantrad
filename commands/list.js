module.exports.run = async (client, message, args, functions) => {
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
            message.channel.send(`Merci de préciser "manga" ou "anime" !`);
            break;
    }
}