const Discord = require('discord.js')
const client = new Discord.Client()
const configYaml = require("config-yaml")
const ArrayList = require("arraylist")
const randomColor = require('randomcolor')
const ytdl = require('ytdl-core');

// Configuration file path
const config = configYaml(`${__dirname}/config.yml`);

client.on('ready', () => {
    console.log("Connected to Discord.")
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: 'Q&A questions',
            type: 'LISTENING'
        }
    })
});

var musicChannel = {}

client.on('message', msg => {
    // Prevent self reply
    if (msg.author.bot) return

    // Delete message on receive
    if (msg.channel.id === "763456631525605376") {
        msg.delete()
    }

    // Get ban list
    var list = new ArrayList;
    list.add(config.banlist);

    // Send ban message if banned
    if (list.contains(msg.author.id)) {
        return msg.author.send("\n> :u7981: **You are banned from lodging questions**\n> I don't think further explanation is required, you know what you have done wrong to deserve this.")
    }

    // Send DM error if message sent via DM
    if (msg.guild === null) {
        return msg.reply("\n> :x: **Perform the command in the server at #bot-commands**")
    }

    if (msg.channel.id !== "763456631525605376") return

    console.log(`---------------------\n
    Author: ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
    Payload: ${msg.content.substr(msg.content.indexOf(" ") + 1)}\n`)

    // For DMs
    // __-theory
    if (msg.content.toLowerCase().startsWith(`${config.discord.prefix}-theory`)) {
        var n = msg.content.split(" ")
        if (n.length >= 2) {
            msg.author.send(`\n> :satellite: **Your Theory Question has been lodged!**\n> We will reply to your question in a heartbeat (hopefully).\n> \n> *Please be considerate by not abusing this bot and only lodge one message for each question that you have.*`)

            var craftMessage = new Discord.MessageEmbed()
                .setColor(randomColor({ hue: "red", luminosity: 'light' }))
                .setTitle(':closed_book: Theory question')
                .setDescription(`${msg.content.substr(msg.content.indexOf(" ") + 1)}`)
                .setFooter('Made by Dylan Kok (Tokiharu Shunage) for NYP AI')

            var channel = client.channels.cache.get('745522904757698590')
            return channel.send(craftMessage)
        } else {
            return msg.author.send("\n> :x: **Invalid Syntax**\n> Command structure is invalid.\n> ```" + config.discord.prefix + "-theory" + " <your question>```")
        }
    }

    // __-practical
    if (msg.content.toLowerCase().startsWith(`${config.discord.prefix}-pract`)) {
        var n = msg.content.split(" ")
        if (n.length >= 2) {
            msg.author.send(`\n> :satellite: **Your Practical Question has been lodged!**\n> We will reply to your question in a heartbeat (hopefully).\n> \n> *Please be considerate by not abusing this bot and only lodge one message for each question that you have.*`)

            var craftMessage = new Discord.MessageEmbed()
                .setColor(randomColor({ hue: "blue", luminosity: 'light' }))
                .setTitle(':blue_book: Practical question')
                .setDescription(`${msg.content.substr(msg.content.indexOf(" ") + 1)}`)
                .setFooter('Made by Dylan Kok (Tokiharu Shunage) for NYP AI')

            var channel = client.channels.cache.get('763264949941436456')
            return channel.send(craftMessage)
        } else {
            return msg.author.send("\n> :x: **Invalid Syntax**\n> Command structure is invalid.\n> ```" + config.discord.prefix + "-pract" + " <your question>```")
        }
    }

    // __-debug
    if (msg.content.toLowerCase().startsWith(`${config.discord.prefix}-debug`)) {
        var n = msg.content.split(" ")
        if (n.length >= 2) {
            msg.author.send(`\n> :ok: **Added to queue.**\n> Please join the Debugging Queue VC and we will attend to you shortly.\n> For now, enjoy some smooth music.`)

            var craftMessage = new Discord.MessageEmbed()
                .setColor(randomColor({ hue: "green", luminosity: 'light' }))
                .setTitle(`:receipt: ${msg.author.username} has joined the queue`)
                .setDescription(`__User ID:__\n${msg.author.id}\n\n__Issue:__\n${msg.content.substr(msg.content.indexOf(" ") + 1)}`)
                .setFooter('Made by Dylan Kok (Tokiharu Shunage) for NYP AI')

            var channel = client.channels.cache.get('763447158036365314')
            return channel.send(craftMessage)
        } else {
            return msg.author.send("\n> :x: **Invalid Syntax**\n> Command structure is invalid.\n> ```" + config.discord.prefix + "-debug" + " <short explanation of your problem>```")
        }
    }

    if (msg.content === `${config.discord.prefix}-lobbymusic` && msg.author.id === "239738629772148737") {
        if (msg.channel.type === 'dm') return;

        const voiceChannel = msg.member.voice.channel;
        musicChannel = voiceChannel

        if (!voiceChannel) {
            return msg.reply('please join a voice channel first!');
        }

        musicStream = () => {
            return musicChannel.join().then(connection => {
                const stream = ytdl('https://www.youtube.com/watch?v=dJwg-mWj7xY', { filter: 'audioonly' });
                const dispatcher = connection.play(stream);

                dispatcher.on('finish', () => musicStream());
            });
        }

        musicStream()
    }
    msg.author.send("\n> :confused: **I can't understand you**\n> As much as I am smart, I am still not a human. Please type a valid command in instead.")
});

client.login(config.discord.botToken);