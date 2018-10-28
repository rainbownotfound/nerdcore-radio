const fs = require('fs');
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = async (client, message, args) => {
    const action = args[0];

    if(!action) {
        message.channel.send({
            embed: utils.embed(`Current Prefix`, `The current prefix is **${prefixes[message.guild.id].prefixes}<command>**!`)
        });
    } else if (action === "new") {

    if(!message.member.permissions.has("MANAGE_SERVER")) return message.channel.send({
        embed: utils.embed(`Error!`, `You don't have the required permissions to edit the prefix!`)
    });

    prefixes[message.guild.id] = {
        prefixes: args[1]
    };

    fs.writeFile(`data/configs/prefixes.json`, JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
    });

    message.channel.send({
        embed: utils.embed(`Prefix Set!`, `Set to **${args[1]}<command>**!`)
    });
    }
}

module.exports.help = {
    command: 'setprefix',
    usage: `<none|new> [newPrefix]`,
    category: 'Main Commands',
    description: 'Set the guild\'s prefix with this command!'
};