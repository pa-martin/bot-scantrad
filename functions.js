const { DMChannel } = require("discord.js");

module.exports = class pamlol {
    constructor(client) {
        this.client = client;
    }
    // Time en ms
    sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    time(type) {
        const colors = require('colors');
        const date = new Date();
        let hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();

        if(hours < 10) hours = '0' + hours;
        if(minutes < 10) minutes = '0' + minutes;
        if(seconds < 10) seconds = '0' + seconds;

        return (`[${hours}:${minutes}:${seconds} ${type}]: `).green;
    }
    checkMp(message) {
        return message.channel.type === 'dm';
    }
    getUserId(arg, message) {
        let userId;

        if(!arg) { message.channel.send(`Rentre un args stp.`); return -1; }
        else if(arg.startsWith("<@!")) userId = arg.substring(0,arg.indexOf(">")).slice(3);
        else if(arg.startsWith("<@")) userId = arg.substring(0,arg.indexOf(">")).slice(2);
        else userId = arg;

        if(!this.client.guilds.cache.get(message.guild.id).members.cache.get(arg)) {
            message.channel.send(`Merci de citer un joueur présent sur le serveur.`)
            return -1;
        }

        return userId;
    }
}