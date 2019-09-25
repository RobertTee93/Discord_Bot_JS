module.exports = {
    name: 'leave',
    description: 'Leave discord Channel.',
    execute(message, args) {

        const {
            voiceChannel
        } = message.member;

        if (!voiceChannel) {
            return message.reply('please join a voice channel first!');
        }


        voiceChannel.leave()


        process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

    },
};