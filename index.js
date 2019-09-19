const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./config.json")

//message.content.startsWith()

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(message.content === `${prefix}ping`){
        message.channel.send("Pong")
    } else if (message.content === `${prefix}pong`) {
        message.channel.send("Ping")
    } else if (message.content === `${prefix}server`) {
        message.channel.send(`This server's name is: ${message.guild.name}\n and it currently has ${message.guild.memberCount} members!`);
    } else if (message.content === `${prefix}user-info`) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    } else if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        } else if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`First argument: ${args[0]}`);
    }
});

client.login(token);
