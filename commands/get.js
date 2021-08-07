module.exports.run = async (client, message, args, functions, buttons) => {
    if(!functions.hasRight(message)) return;
    
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
            message.channel.send(`Merci de préciser "manga" ou "anime" !`);
            break;
    }
}