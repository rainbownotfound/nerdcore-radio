const sql = require('sqlite');
const utils = require('../utils');
sql.open('./commands/data/databases/artist-radios.sqlite');

module.exports.run = (client, message, args) => {
    sql.get(`SELECT * FROM playing WHERE guildID = "${message.guild.id}"`).then(row => {
        if(!row) {
            sql.run(`INSERT INTO playing (guildID, isReady) VALUES (?, ?)`, [message.guild.id, "Yes"]);
    
            message.channel.send({
                embed: utils.embed(`Notice`, `I have added this server to my database! Please try the command again.`)
            });
        } else {
            const voiceChannel = message.member.voiceChannel;

            if(!voiceChannel) {
                message.channel.send({
                    embed: utils.embed(`Error!`, `I couldn't find your Voice Channel...\n\nNeed help? You can always join our [Support Server](https://discord.gg/ty7WTw9)!`, [], {
                        color: "#ff0000"
                    })
                });
            } else {
                voiceChannel.leave();

                message.channel.send({
                    embed: utils.embed(`Notice`, `Successfully Disconnected!`)
                });

                sql.run(`UPDATE playing SET isReady = "Yes" WHERE guildID = "${message.guild.id}"`);
            }
        }
    }).catch(() => {
        sql.run(`CREATE TABLE IF NOT EXISTS playing (guildID TEXT, isReady TEXT)`).then(() => {
            sql.run(`INSERT INTO playing (guildID, isReady) VALUES (?, ?)`, [message.guild.id, "Yes"]);

            message.channel.send({
                embed: utils.embed(`Notice`, `I have added this server to my database! Please try the command again.`)
            });
        });
    });
};

module.exports.help = {
    command: 'leave',
    usage: `No Usage Specified`,
    category: 'Main Commands',
    description: 'Make the bot leave the voice chat!'
};