const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Play a youtube url.',
    execute(message, args) {
        
        const { voiceChannel } = message.member;

            if (!voiceChannel) {
                return message.reply('please join a voice channel first!');
            }

            voiceChannel.join().then(connection => {
                console.log("STARTING STREAM");
                const stream = ytdl('https://www.youtube.com/watch?v=RhU9MZ98jxo', {
                    filter: 'audioonly'
                });

                setTimeout(() => {
                    const dispatcher = connection.playStream(stream);

                    dispatcher.on('end', () => voiceChannel.leave());
                }, 500)
            });

            process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

    },
};