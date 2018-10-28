const fs = require('fs');
const stripIndents = require('common-tags').stripIndents;
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = (client, message, args) => {
    if(message.author.id !== "325951812991451137" || message.author.id !== "268853598862049280" || message.author.id !== "304016056341626881") {
        message.channel.send({
            embed: utils.embed(`Error!`, `This command is for Developers only!`, [], {
                color: '#ff0000'
            })
        });
    } else {
        let code = args.join(' ');
        let output;

        try {
            output = eval(code);
        } catch (err) {
            let msg = err;
            if(err && err.response && err.response.body && err.response.body.message) {
                message = err.response.body.message;
            }
            return errorHandler(message, client, code, `${msg}`);
        }

        if(typeof output !== "string") {
            output = require('util').inspect(output);
        }

        output = clean(output).replace(new RegExp(utils.quoteRegex(client.token), 'g'), 'BOT_TOKEN');

        message.channel.send({
            embed: utils.embed('', stripIndents`
            **Input:**\n\`\`\`js\n${code}\n\`\`\`
            **Output:**\n\`\`\`js\n${output}\n\`\`\`
            `)
        });
    };
};

function errorHandler(message, client, code, err) {
    message.channel.send({
        embed: utils.embed('', `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n:x: **Error!**\n\`\`\`xl\n${clean(err)}\n\`\`\``, [], {
            color: '#ff0000'
        })
    });
};

function clean(text) {
    return text.replace(/([`@#])/g, '$1\u200b');
};

module.exports.help = {
    command: 'eval',
    usage: `<code>`,
    category: 'Developer',
    description: 'Evaluate a piece of code!'
};