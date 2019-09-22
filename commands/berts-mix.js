module.exports = {
    name: 'berts-mix',
    description: 'Get Roberts playlist.',
    execute(message, args) {
        message.channel.send('https://www.youtube.com/playlist?list=PLRvGixglzpD1pltZXoaZrl-kEcYpPdUFK');
    },
};