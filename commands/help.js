const fs = require('fs');
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = async (client, message, args) => {
    let commandz = client.commands.map(c => `[${c.help.command}](${c.help.description})`).join('\n');
    const action = args[0];

    if(!action) {
        message.channel.send({
            embed: utils.embed(`All Commands`, `Total Commands: ${client.commands.size}\n\`\`\`markdown\n${commandz}\n\`\`\``, [
                {
                    name: 'Extra Help',
                    value: 'Try \`n@help <command>\` for more info on a certain command!\n*Do not include the <>*'
                }
            ])
        });
    } else if (action === "all") {
        message.channel.send({
            embed: utils.embed(`All Commands`, `Total Commands: ${client.commands.size}\n\`\`\`markdown\n${commandz}\n\`\`\``, [
                {
                    name: 'Extra Help',
                    value: 'Try \`n@help <command>\` for more info on a certain command!\n*Do not include the <>*'
                }
            ])
        });
    } else {
        const commandsFinder = client.commands.get(args[0]);

        if(!commandsFinder) {
            message.channel.send({
                embed: utils.embed(`Error!`, `I could not find command **${args[0]}**!`, [
                    {
                        name: 'Possible Solutions',
                        value: 'Please try \`n@help all\` for a list of all commands!'
                    },
                    {
                        name: 'Nothing Helped?',
                        value: 'You can always try to join our [Support Server!](https://discord.gg/RXhCaEk)!'
                    }
                ], {
                    color: "#ff0000"
                })
            });
        } else {
            message.channel.send({
                embed: utils.embed(`Command - ${args[0]}`, `${commandsFinder.help.description}`, [
                    {
                        name: 'Name',
                        value: commandsFinder.help.command
                    },
                    {
                        name: 'Usage',
                        value: commandsFinder.help.usage
                    },
                    {
                        name: 'Category',
                        value: commandsFinder.help.category
                    },
                    {
                        name: 'Extra',
                        value: `Please read the disclaimer with \`${prefixes[message.guild.id].prefixes}disclaimer\``
                    }
                ], {
                    inline: true
                })
            });
        };
    }
};

module.exports.help = {
    command: 'help',
    usage: `<all|command>`,
    category: 'Info',
    description: 'You won\'t need any more info on this'
};