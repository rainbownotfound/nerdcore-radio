const fs = require('fs');
const stripIndents = require('common-tags').stripIndents;
const utils = require('../utils');

let prefixes = JSON.parse(fs.readFileSync("data/configs/prefixes.json", "utf8"));

module.exports.run = (client, message, args) => {
    message.channel.send({
        embed: utils.embed(`Nerdcore Radio Disclaimer`, stripIndents`
        Nerdcore Radio is a Discord bot that plays your favourite nerdcore artists in Discord.

        All artists that are supported in Nerdcore Radio have given their permission to use their songs in the bot.
        This, however, does not mean that users have a license to use their songs in YouTube videos/streams, as Content ID will still see this as copyright infringement and will take down the stream.

        The Nerdcore Radio Developers are not responsible for streams being taken down and/or channels being copyright striked during bot usage in streams. If you use decide to the bot in your stream, it will come with your own risk of being taken down.

        No download links will be provided and no YouTube converters are used in this bot. All the songs you hear are being streamed straight from YouTube, to Discord.

        **__Terms of Logging:__**
        *By using this bot in your server, you agree to the Terms of Logging, which are stated below.*

        **Permission Errors**
        1.1: We will collect data if a PermissionError occurs. This will only occur when the permissions \`SPEAK\` and/or \`CONNECT\` are missing.
        1.2: We will collect the user's username and discriminator, the channel's name and ID and the guild's name and ID.
        1.3: We will not use this information for any illegal actions, such as hacking, DDOS attacks, etc.

        **Guild Updates**
        2.1: We will collect your guild's name and ID once the bot has been added/removed from your server.
        2.2: We will show your guild's icon in the logs.
        2.3: When we suspect your server from abusing our bot, we will gather more info about your server and we will block your server from bot usage. Appeals can be made [here](https://goo.gl/forms/sOMAi7VIk0QqBKJD3)

        **Radio Activation**
        3.1: We will log the radio you have activated, together with your username, discriminator and ID.
        3.2: We will log your guild's name and ID.
        3.3: We will log the text channel and voice channel's names and IDs.
        3.4: We will use this information upon necessary. This includes:
        3.4.1: Upon requesting assistance with the bot.
        3.4.2: Once the same error occurs 3 times within 5-10 minutes. We will contact you.
        `)
    });
};

module.exports.help = {
    command: 'disclaimer',
    usage: `No Usage Specified`,
    category: 'Main Commands',
    description: 'VERY IMPORTANT! MUST READ!'
};