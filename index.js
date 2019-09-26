const Discord = require('discord.js');
const {
    prefix,
    token
} = require('./config.json');
const fs = require('fs')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const queue = new Map()

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}



client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const serverQueue = queue.get(message.guild.id);


    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {

        let reply = `You didn't provide any arguments, ${message.author}!`
        
        if(command.usage){
            reply += `\n the proper usage would be: \`${prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply)
    }

    //COOLDOWNS
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    //COMMAND EXECUTE
    try {
        command.execute(message, args, queue, serverQueue);
    } catch (error){
        console.error(error);
        message.reply('there was an error trying to execute that command!')
    }
});

// client.on('message', async message => {
//     if (message.author.bot) return;
//     if (!message.content.startsWith(prefix)) return;

//     if (message.content.startsWith(`${prefix}playytdl`)) {
//         execute(message, serverQueue);
//         return;
//     } else if (message.content.startsWith(`${prefix}skipytdl`)) {
//         skip(message, serverQueue);
//         return;
//     } else if (message.content.startsWith(`${prefix}stopytdl`)) {
//         stop(message, serverQueue);
//         return;
//     } else {
//         message.channel.send('You need to enter a valid command!')
//     }
// });

// async function execute(message, serverQueue) {
//     const args = message.content.split(' ');

//     const voiceChannel = message.member.voiceChannel;
//     if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
//     const permissions = voiceChannel.permissionsFor(message.client.user);
//     if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
//         return message.channel.send('I need the permissions to join and speak in your voice channel!');
//     }

//     const songInfo = await ytdl.getInfo(args[1]);
//     const song = {
//         title: songInfo.title,
//         url: songInfo.video_url,
//     };

//     if (!serverQueue) {
//         const queueContruct = {
//             textChannel: message.channel,
//             voiceChannel: voiceChannel,
//             connection: null,
//             songs: [],
//             volume: 5,
//             playing: true,
//         };

//         queue.set(message.guild.id, queueContruct);

//         queueContruct.songs.push(song);

//         try {
//             var connection = await voiceChannel.join();
//             queueContruct.connection = connection;
//             play(message.guild, queueContruct.songs[0]);
//         } catch (err) {
//             console.log(err);
//             queue.delete(message.guild.id);
//             return message.channel.send(err);
//         }
//     } else {
//         serverQueue.songs.push(song);
//         console.log(serverQueue.songs);
//         return message.channel.send(`${song.title} has been added to the queue!`);
//     }

// }

// function skip(message, serverQueue) {
//     if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
//     if (!serverQueue) return message.channel.send('There is no song that I could skip!');
//     serverQueue.connection.dispatcher.end();
// }

// function stop(message, serverQueue) {
//     if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
//     serverQueue.songs = [];
//     serverQueue.connection.dispatcher.end();
// }

// function play(guild, song) {
//     const serverQueue = queue.get(guild.id);

//     if (!song) {
//         serverQueue.voiceChannel.leave();
//         queue.delete(guild.id);
//         return;
//     }

//     const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
//         .on('end', () => {
//             console.log('Music ended!');
//             serverQueue.songs.shift();
//             play(guild, serverQueue.songs[0]);
//         })
//         .on('error', error => {
//             console.error(error);
//         });
//     dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
// }

client.login(token);
