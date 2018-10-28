const fs = require('fs');
const moment = require('moment');
require('moment-duration-format');
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = (client, message, args) => {
    const voiceConnections = client.voiceConnections.size;
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [sec]");

    const shards = `${client.shard.id} / ${client.shard.count}`;

    message.channel.send({
        embed: utils.embed(`Bot Info`, ``, [
            {
                name: 'User ID',
                value: client.user.id
            },
            {
                name: 'Username',
                value: client.user.username
            },
            {
                name: 'Discriminator',
                value: client.user.discriminator
            },
            {
                name: 'Commands',
                value: client.commands.size
            },
            {
                name: 'Server Count',
                value: client.guilds.size
            },
            {
                name: 'Users',
                value: client.users.size
            },
            {
                name: 'Shard',
                value: shards
            },
            {
                name: 'Voice Connections',
                value: voiceConnections
            },
            {
                name: 'Uptime',
                value: duration
            }
        ], { thumbnail: client.user.avatarURL, inline: true })
    });
};

module.exports.help = {
    command: 'botinfo',
    usage: `No Usage Specified`,
    category: 'Main Commands',
    description: 'Get info on the bot!'
};