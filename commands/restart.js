const fs = require('fs');
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = (client, message, args) => {
    if(message.author.id !== "325951812991451137" && message.author.id !== "268853598862049280" && message.author.id !== "304016056341626881" && message.author.id !== "321242389106786314") {
        message.channel.send({
            embed: utils.embed(`Error!`, `You are lacking the permissions \`BOT_DEVELOPER\` to use this command`, [], {
                color: "#ff0000"
            })
        });
    } else {
        message.channel.send('Restarting now!');

        const timeout1 = setTimeout(function() {
            client.user.setStatus("invisible");
        }, 1000);

        const timeout2 = setTimeout(function() {
            process.exit();
        }, 2000);
    }
};

module.exports.help = {
    command: 'restart',
    usage: `No Usage Specified`,
    category: 'Developer',
    description: 'Restart the bot!'
};