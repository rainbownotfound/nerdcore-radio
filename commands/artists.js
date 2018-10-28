const fs = require('fs');
const stripIndents = require('common-tags');
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = (client, message, args) => {
    message.channel.send({
        embed: utils.embed(`Artists List`, stripIndents`
        The following artists are supported by Nerdcore Radio:
        \`\`\`
        Alicia Michelle
        CG5
        Dan Bull
        Dolvondo
        Groundbreaking
        HalaCG
        JT Music
        Musiclide
        Nenorama
        Russell Sapphire
        Siege Rising
        TryHardNinja
        \`\`\`
        `)
    })
};

module.exports.help = {
    command: 'artists',
    usage: `n/artists`,
    category: 'Main Commands',
    description: 'List all the artists supported by Nerdcore Radio!'
};