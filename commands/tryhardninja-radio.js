const sql = require('sqlite');
const yt = require('ytdl-core');
const stripIndents = require('common-tags').stripIndents;
const utils = require('../utils');
const config = require('../config.json');
sql.open('./artist-radios.sqlite');
let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = (client, message, args) => {
    function infiniteLooper(dispatcherCB, connection) {
        dispatcherCB.on('end', () => {
            sql.get(`SELECT * FROM tryhardninja ORDER BY RANDOM() LIMIT 1`).then(row => {
                sql.get(`SELECT * FROM playing WHERE guildID = "${message.guild.id}"`).then(row2 => {
                    if(!row2) {
                        sql.run(`INSERT INTO playing (guildID, isReady) VALUES (?, ?)`, [message.guild.id, "Yes"]);
    
                        message.channel.send({
                            embed: utils.embed(`Notice`, `I have added this server to my database! Please try the command again.`)
                        });
                    }
                    var featuring = row.featuring;
                    let featuringText;
                    if(featuring === "None") {
                        featuringText = "";
                    } else {
                        featuringText = ` feat. **${featuring}**`;
                    }
    
                    var dispatcher = () => connection.playStream(yt(`${row.link}`));
                    infiniteLooper(dispatcher(), connection);
                    
                    if(row2.isReady === "No") {
                        message.channel.send({
                            embed: utils.embed(`Now Playing`, `**${row.name}** by **${row.creator}**${featuringText}`)
                        });
                    }
                });
            }).catch(() => {
                sql.run(`CREATE TABLE IF NOT EXISTS tryhardninja (link TEXT, name TEXT, creator TEXT, featuring TEXT)`).then(() => {
                    message.channel.send({
                        embed: utils.embed(`Error!`, `TryHardNinja Radio is currently empty! Please contact the developers about this issue using \`${prefixes[message.guild.id].prefixes}reportbug\``)
                    });
                });
            });
        });
    }
    const action = args[0];
    const voiceChannel = message.member.voiceChannel;

    if(!action) {
        if(!voiceChannel) {
            message.channel.send({
                embed: utils.embed(`Error!`, `I couldn\'t find your voice channel, please join one and try again!`, [], {
                    color: "#ff0000"
                })
            });

            client.channels.get("491661236606468107").send({
                embed: utils.embed(`ErrorLogger`, stripIndents`
                ${message.author.tag} just received an error for **TryHardNinja Radio**!

                VoiceChannelError
                Instance VoiceChannel not found
                `)
            })
        } else if (!voiceChannel.permissionsFor(client.user).has(["SPEAK", "CONNECT"])) {
            message.channel.send({
                embed: utils.embed(`Error!`, `I am missing permissions for this voice channel! Please check if the permissions \`CONNECT\` and \`SPEAK\` are enabled!`, [], {
                    color: "#ff0000"
                })
            });

            client.channels.get("491661236606468107").send({
                embed: utils.embed(`ErrorLogger`, stripIndents`
                ${message.author.tag} just received an error for **TryHardNinja Radio**!
                
                PermissionError ID 3145728
                CONNECT 1048576
                SPEAK 2097152
                `, [], {
                    color: "#01DFD7"
                })
            });
        } else {
            sql.get(`SELECT * FROM tryhardninja ORDER BY RANDOM() LIMIT 1`).then(row1 => {
                sql.get(`SELECT * FROM playing WHERE guildID = "${message.guild.id}"`).then(row2 => {
                    if(!row2) {
                        sql.run(`INSERT INTO playing (guildID, isReady) VALUES (?, ?)`, [message.guild.id, "Yes"]);
    
                        message.channel.send({
                            embed: utils.embed(`Notice`, `I have added this server to my database! Please try the command again.`)
                        });
                    } else if(row2.isReady === "Yes") {
                var featuring = row1.featuring;
                let featuringText;
                if(featuring === "None") {
                    featuringText = "";
                } else {
                    featuringText = ` feat. ${featuring}`
                }
                var dispatcher = () => message.guild.voiceConnection.playStream(yt(`${row1.link}`));
                voiceChannel.join()
                    .then(connection => {
                        message.channel.send({
                            embed: utils.embed(`Radio Activated!`, stripIndents`
                            The Radio started playing the following song:

                            ${row1.creator} - ${row1.name}${featuringText}
                            That's a nice start isn't it?
                            `)
                        });
                        sql.run(`UPDATE playing SET isReady = "No" WHERE guildID = "${message.guild.id}"`);
                        infiniteLooper(dispatcher(), connection);

                        client.channels.get("491651076156686336").send({
                            embed: utils.embed(`Radio Activated!`, `${message.author.tag} has activated **TryHardNinja Radio** in ${message.guild.name} (${message.guild.id})`)
                        });
                    });
                    } else {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `I'm already playing music!`, [
                                {
                                    name: 'Possible Solutions',
                                    value: `Try \`${prefixes[message.guild.id].prefixes}leave\` then request your preferred radio!`
                                },
                                {
                                    name: 'Nothing Helped?',
                                    value: 'You can always join our [Support Server](https://discord.gg/RXhCaEk)!'
                                }
                            ])
                        });
                    }
                }).catch(() => {
                    sql.run(`CREATE TABLE IF NOT EXISTS playing (guildID TEXT, isReady TEXT)`).then(() => {
                        sql.run(`INSERT INTO playing (guildID, isReady) VALUES (?, ?)`, [message.guild.id, "Yes"]);
            
                        message.channel.send({
                            embed: utils.embed(`Notice`, `I have added this server to my database! Please try the command again.`)
                        });
                    });
                });
            }).catch(() => {
                sql.run(`CREATE TABLE IF NOT EXISTS tryhardninja (link TEXT, name TEXT, creator TEXT, featuring TEXT)`).then(() => {
                    message.channel.send({
                        embed: utils.embed(`Error!`, `TryHardNinja Radio is currently empty! Please contact the developers about this issue using \`${prefixes[message.guild.id].prefixes}reportbug\``)
                    });
                });
            });
        }
    } else if (action === "add") {
        if(message.author.id !== config.devs.rainbow && message.author.id !== config.devs.cernine && message.author.id !== config.devs.elliot) {
            message.channel.send({
                embed: utils.embed(`Error!`, `You are missing the permission \`BOT_DEVELOPER\` to use this argument!`, [
                    {
                        name: 'Possible Solutions',
                        value: 'There\'s no way to fix this.'
                    },
                    {
                        name: 'Nothing Helped?',
                        value: 'You can always join our [Support Server](https://discord.gg/RXhCaEk)!'
                    }
                ])
            });
        } else {
            const songLink = args.slice(4).join(' ');

            var featuring = args[3];
            let featuringText;
            if(featuring === "None") {
                featuringText = "";
            } else {
                featuringText = ` feat. ${featuring}`;
            }

            if(!songLink) {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You must specify a YouTube link!`, [], {
                        color: "#ff0000"
                    })
                });
            } else {
                sql.get(`SELECT * FROM tryhardninja WHERE name = "${args[1]}"`).then(row => {
                    if(!row) {
                        sql.run(`INSERT INTO tryhardninja (link, name, creator, featuring) VALUES (?, ?, ?, ?)`, [songLink, args[1], args[2], args[3]]);

                        message.channel.send({
                            embed: utils.embed(`Song Added!`, `Song **${args[1]}** by **${args[2]}${featuringText}** added successfully!`)
                        });
                    } else {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This song already exists!`, [], {
                                color: "#ff0000"
                            })
                        });
                    }
                }).catch(() => {
                    sql.run(`CREATE TABLE IF NOT EXISTS tryhardninja (link TEXT, name TEXT, creator TEXT, featuring TEXT)`).then(() => {
                        sql.run(`INSERT INTO tryhardninja (link, name, creator, featuring) VALUES (?, ?, ?, ?)`, [songLink, args[1], args[2], args[3]]);

                        message.channel.send({
                            embed: utils.embed(`Song Added!`, `Song **${args[1]}** by **${args[2]}${featuringText}** added successfully!`)
                        });
                    });
                });
            }
        }
    } else if (action === "delete") {
        if(message.author.id !== config.devs.rainbow && message.author.id !== config.devs.cernine && message.author.id !== config.devs.elliot) {
            message.channel.send({
                embed: utils.embed(`Error!`, `You are missing the permission \`BOT_DEVELOPER\` to use this argument!`, [
                    {
                        name: 'Possible Solutions',
                        value: 'There\'s no way to fix this.'
                    },
                    {
                        name: 'Nothing Helped?',
                        value: 'You can always join our [Support Server](https://discord.gg/RXhCaEk)!'
                    }
                ])
            });
        } else {
            sql.get(`SELECT * FROM tryhardninja WHERE name = "${args[1]}"`).then(row => {
                if(!row) {
                    message.channel.send({
                        embed: utils.embed(`Error!`, `That song isn't added or already deleted!`, [], {
                            color: "#ff0000"
                        })
                    });
                } else {
                    sql.run(`DELETE FROM tryhardninja WHERE name = "${args[1]}"`);
                    message.channel.send({
                        embed: utils.embed(`Success!`, `Successfully deleted song **${args[1]}**!`)
                    });
                }
            })
        }
    }
};

module.exports.help = {
    command: 'tryhardninja',
    usage: 'tryhardninja',
    category: 'Radios',
    description: 'Listen to TryHardNinja\'s songs with TryHardNinja Radio!'
};