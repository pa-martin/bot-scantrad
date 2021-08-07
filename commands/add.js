module.exports.run = async (client, message, args, functions) => {
    if(!functions.hasRight(message)) return;
    
    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./add manga.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        default:
            message.channel.send(`Merci de préciser "manga" ou "anime" !`);
            break;
    }
}