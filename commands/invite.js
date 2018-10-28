const fs = require('fs');
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = (client, message, args) => {
    message.channel.send({
        embed: utils.embed(`Invite me!`, `Here's the invite link to invite me to your server!\n\nhttps://discordapp.com/oauth2/authorize?client_id=477713081385091072&permissions=3263488&scope=bot\n\nSupport Server: https://discord.gg/RXhCaEk \nBot Website: Coming Soon...`)
    });
};

module.exports.help = {
    command: 'invite',
    usage: `No Usage Specified`,
    category: 'Info',
    description: 'Invite me to your server!'
};