module.exports.run = async (client, message, args, functions, Discord) => {
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
            const mangaButton = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('manga')
					.setLabel('Manga')
					.setStyle('PRIMARY'),
			);
            const animeButton = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('anime')
					.setLabel('Anime')
					.setStyle('PRIMARY'),
			);
            message.channel.send({content: `Plutôt manga ou anime ?`, components: [mangaButton, animeButton] });
            break;
    }
}