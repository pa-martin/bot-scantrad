module.exports.run = async (client, message, args, functions) => {
    if(!functions.hasRight(message)) return;
    
    switch(args[0]) {
        case "manga":
            try {
                let commandFile = require(`./add manga.js`);
                commandFile.run(client, message, args.shift(), functions);
            } catch (err) {}
            break;
        default:
            break;
    }
}