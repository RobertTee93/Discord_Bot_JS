const ytdl = require('ytdl-core');

const {
    youtubeKey
} = require('../config.json');
const {
    google
} = require('googleapis');

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

        var youtube = google.youtube({
            version: 'v3',
            auth: youtubeKey
        });

        if (args[0].includes("playlist")) {

            let playlistID = args[0].split("=")

            handlePlaylistSearch(playlistID, [], "first")

        } else {

            let searchArgs = args.join("+")

            youtube.search.list({
                    part: 'snippet',
                    q: searchArgs,
                    type: "video"
                })
                .then(data => {
                    let searchResults = data.data.items

                    let searchItem = searchResults[0].id.videoId

                    if (args[0].includes("https://www.youtube.com")) {
                        searchItem = args[0]
                    }

                    handleSingleSong(searchItem)

                })
                .catch(err => console.log(err))

        }

        function play(guild, song) {
            const serverQueue = queue.get(guild.id);

            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }

            const dispatcher = serverQueue.connection.playStream(ytdl(song.url), {
                    highWaterMark: "1000"
                })
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

        function handleSingleSong(searchItem) {
            ytdl.getInfo(searchItem)
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
        }

        async function handlePlaylistSearch(playlistID, songs, nextPage) {

            if (nextPage === "first") {
                let data = await youtube.playlistItems.list({
                    part: 'snippet',
                    playlistId: playlistID[1],
                    maxResults: 50
                })

                songs = [...songs, ...data.data.items]

                handlePlaylistSearch(playlistID, songs, data.data.nextPageToken)

            } else if (nextPage) {
                let data = await youtube.playlistItems.list({
                    part: 'snippet',
                    playlistId: playlistID[1],
                    pageToken: nextPage,
                    maxResults: 50
                })

                songs = [...songs, ...data.data.items]

                handlePlaylistSearch(playlistID, songs, data.data.nextPageToken)
            } else {

                console.log(songs.length)

                handlePlaylistPlay(songs)

            }
        }

        function handlePlaylistPlay(songs) {

            songs = songs.map(song => {
                return {
                    title: song.snippet.title,
                    url: `https://www.youtube.com/watch?v=${song.snippet.resourceId.videoId}`
                }
            })

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

                queueContruct.songs = [...songs]

                try {
                    voiceChannel.join()
                        .then((connection) => {
                            queueContruct.connection = connection;
                            play(message.guild, queueContruct.songs[0]);
                            return message.channel.send(`${queueContruct.songs.length} songs have been added to the queue!`)
                        })
                } catch (err) {
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
            } else {
                serverQueue.songs = [...serverQueue.songs, ...songs]
                console.log(serverQueue.songs);
                return message.channel.send(`${songs.length} songs have been added to the queue!`);
            }

        }
    }
}
