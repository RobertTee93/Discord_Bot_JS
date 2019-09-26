const ytdl = require('ytdl-core');

module.exports = {
    name: 'playtest',
    description: 'testing ytdl',
    cooldown: 5,
    execute(message, args) {

        const {
            voiceChannel
        } = message.member;

        if (!voiceChannel) {
            return message.reply('please join a voice channel first!');
        }

        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=D57Y1PruTlw', {
                filter: 'audioonly'
            });
            const dispatcher = connection.playStream(stream);

            dispatcher.on('end', () => voiceChannel.leave());
        });
        
    },
}