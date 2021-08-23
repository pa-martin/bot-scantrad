module.exports.run = async (client, message, args, functions) => {
    message.delete();
    const button = functions.createLinkButton('https://discord.com/api/oauth2/authorize?client_id=847862252471189524&permissions=8&scope=bot', 'Ajoute-moi !');
    message.channel.send({content: "Ajoute-moi sur ton serveur perso !", components: [button]}).then(m => { setTimeout(function () { m.delete()} , 10*1000) });
}