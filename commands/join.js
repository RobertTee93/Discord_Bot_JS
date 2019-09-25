module.exports = {
    name: 'join',
    description: 'Join discord Channel.',
    execute(message, args) {
    
        const { voiceChannel } = message.member;

            if (!voiceChannel) {
                return message.reply('please join a voice channel first!');
            }


            voiceChannel.join()

    },
};