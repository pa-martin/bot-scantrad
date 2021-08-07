module.exports.run = async (client, message, args, functions) => {
    if(!functions.hasRight(message)) return;
    
    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./setup manga.js`);
                message.content = message.content.slice(("!setup manga ").length);
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "anime":
            try {
                let commandFile = require(`./setup anime.js`);
                message.content = message.content.slice(("!setup anime ").length);
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        default:
            message.channel.send(`Merci de préciser "manga" ou "anime" !`);
            break;
    }
}