module.exports.run = async (client, message, args, functions) => {
    try {
        let commandFile = require(`./remove.js`);
        commandFile.run(client, message, args, functions);
    } catch (err) {}
}