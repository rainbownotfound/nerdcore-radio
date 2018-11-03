const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);

const fs = require('fs');
const Discord = require('discord.js');
const stripIndents = require('common-tags').stripIndents;
const config = require('commands/data/configs/config.json');
const utils = require('./utils');
const client = new Discord.Client({
    shardCount: 1,
    fetchAllMembers: true
});
client.commands = new Discord.Collection();
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.DBL_TOKEN, client);

fs.readdir('./commands/', (err, files) => {
    if(err) return console.log(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");

    if(jsFiles <= 0) {
        console.log(`No commands have been loaded.`);
        return;
    } else {
        console.log(`${jsFiles.length} commands have been loaded.`);
    }

    jsFiles.forEach((f, i) => {
        let cmds = require(`./commands/${f}`);
        client.commands.set(cmds.help.command, cmds);
    });
});

client.on('ready', () => {
    console.log(`I am ready to rumble! Current Server Count: ${client.guilds.size}`);

    client.user.setPresence({ game: { name: 'Currently Being Rewritten', type: 'PLAYING' }, status: 'dnd' });

    setInterval(function() {
        dbl.postStats(client.guilds.size, client.shard.id, client.shard.count);
    }, 1800000);
});

client.on("guildCreate", guild => {
    client.channels.get('477721076042825758').send({
        embed: utils.embed(`GuildLogger`, stripIndents`
        Server Add Detected.

        **Server Details:**
        Name: ${guild.name}
        ID: ${guild.id}
        Total Users: ${guild.members.filter(m => m.presence.status !== 'offline').size} / ${guild.memberCount}
        Text Channels: ${guild.channels.filter(m => m.type === 'text').size}
        Voice Channels: ${guild.channels.filter(m => m.type === 'voice').size}
        Categories: ${guild.channels.filter(m => m.type === 'category').size}

        **New Stats:**
        Total Servers: ${client.guilds.size}
        Total Channels: ${client.channels.size}
        Total Users: ${client.users.size}
        `, [], {
            thumbnail: guild.iconURL,
            color: "#00FF00"
        })
    });
});

client.on("guildDelete", guild => {
    client.channels.get('477721076042825758').send({
        embed: utils.embed(`GuildLogger`, stripIndents`
        Server Removal Detected.

        **Server Details:**
        Name: ${guild.name}
        ID: ${guild.id}
        Total Users: ${guild.members.filter(m => m.presence.status !== 'offline').size} / ${guild.memberCount}
        Text Channels: ${guild.channels.filter(m => m.type === 'text').size}
        Voice Channels: ${guild.channels.filter(m => m.type === 'voice').size}
        Categories: ${guild.channels.filter(m => m.type === 'category').size}

        **New Stats:**
        Total Servers: ${client.guilds.size}
        Total Channels: ${client.channels.size}
        Total Users: ${client.users.size}
        `, [], {
            thumbnail: guild.iconURL,
            color: "#ff0000"
        })
    });
});

client.on("message", message => {
    const prefixes = ['n/', 'N/', `<@${client.user.id}> `];
    let prefix = false;
    for(const thisPrefix of prefixes) {
        if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
    }
    if(!prefix) return;

    if(message.channel.type === "dm") {
        message.reply(`Please use me in a public server. Thank you.`);
    } else {
        var cont = message.content.slice(prefix.length).split(" ");
        var args = cont.slice(1);
        var cmd = client.commands.get(cont[0]);
        if(cmd) {
            cmd.run(client, message, args);
        }
    }
});

client.login(process.env.TOKEN);