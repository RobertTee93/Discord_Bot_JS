const ytdl = require('ytdl-core');

const { youtubeKey } = require('../config.json');
const { google } = require('googleapis');

module.exports = {
    name: 'play',
    description: 'Play/queue music when given a youtube url.',
    cooldown: 5,
    execute(message, args, queue, serverQueue) {

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

        ytdl.getInfo(args[0])
        .then(songInfo => {

            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };

            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };

                queue.set(message.guild.id, queueContruct);

                queueContruct.songs.push(song);

                try {
                    voiceChannel.join()
                        .then((connection) => {
                            queueContruct.connection = connection;
                            play(message.guild, queueContruct.songs[0]);
                        })
                } catch (err) {
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                return message.channel.send(`${song.title} has been added to the queue!`);
            }

        })

        function play(guild, song) {
            const serverQueue = queue.get(guild.id);

            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }

            const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
                .on('end', () => {
                    console.log('Music ended!');
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on('error', error => {
                    console.error(error);
                });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        }
    }
}

        // youtube.search.list({
        //     part: 'snippet',
        //     q: 'your search query'
        // }, function (err, data) {
        //     if (err) {
        //         console.error('Error: ' + err);
        //     }
        //     if (data) {
        //         console.log(data)
        //     }
        // });
