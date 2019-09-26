module.exports = {
    name: 'skip',
    description: 'Skip song in queue.',
    cooldown: 5,
    execute(message, args, queue, serverQueue) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue) return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
    },
};