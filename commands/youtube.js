const ytdl = require('ytdl-core');

module.exports = {
    name: 'playr',
    description: 'Play a youtube url.',
    args: true,
    usage: '<link>',
    execute(message, args) {
        
        const { voiceChannel } = message.member;

            if (!voiceChannel) {
                return message.reply('please join a voice channel first!');
            }


            voiceChannel.join().then(connection => {
                console.log("STARTING STREAM");
                const stream = ytdl(`${args[0]}`, {
                    filter: 'audioonly'
                });

                const dispatcher = connection.playStream(stream);

                dispatcher.on('error', error => {
                    console.log(error)
                });

                dispatcher.on('end', () => voiceChannel.leave())
                
            })
            .catch(err => console.log("ERROR", err))

            process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

    },
};