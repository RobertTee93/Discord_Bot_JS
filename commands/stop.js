module.exports = {
    name: 'stop',
    description: 'Stop music playing and clear queue.',
    cooldown: 5,
    execute(message, args, queue, serverQueue){
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
};