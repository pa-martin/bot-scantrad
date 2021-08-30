module.exports.run = async (client, message, args, functions) => {
    message.delete();
    
    switch(args[0]) {
        case "add":
            try {
                let commandFile = require(`./dm add.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "setup":
            try {
                let commandFile = require(`./dm setup.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        case "refresh":
            try {
                let commandFile = require(`./dm refresh.js`);
                args.shift();
                commandFile.run(client, message, args, functions);
            } catch (err) {}
            break;
        default:
            const addButton = functions.createButton('dm add', 'Ajouter une annonce', 'PRIMARY');
            const setupButton = functions.createButton('dm setup', 'Setup une annonce', 'PRIMARY');
            const refreshButton = functions.createButton('dm refresh', 'Refresh les annonces', 'PRIMARY');
            message.channel.send({content: `Que souhaites-tu faire ?`, components: [addButton, setupButton, refreshButton] });
            break;
    }
}