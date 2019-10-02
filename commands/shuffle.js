module.exports = {
    name: 'shuffle',
    description: 'Shuffle current queued music.',
    cooldown: 5,
    execute(message, args, queue, serverQueue) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
            var j, x, i;
            for (i = serverQueue.songs.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = serverQueue.songs[i];
                serverQueue.songs[i] = serverQueue.songs[j];
                serverQueue.songs[j] = x;
            }
            return message.channel.send("Queue has been shuffled succesfully.")
    },
};