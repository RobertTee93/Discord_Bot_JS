module.exports = {
    name: 'server',
    guildOnly: true,
    description: 'Server name and current member count!',
    execute(message, args) {
        message.channel.send(`The current server is: ${message.guild.name}\n and it has ${message.guild.memberCount} members.`);
    },
};