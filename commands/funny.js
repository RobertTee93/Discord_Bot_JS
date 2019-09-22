const fetch = require('node-fetch')

module.exports = {
    name: 'funny',
    description: 'Display a random funny image!',
    execute(message, args) {

        let loadingMessages = ['Fetching Funny...', 'Funny incoming', 'beep boop beep...']

        let loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

        message.channel.send(`${loadingMessage}`)

        fetch('https://www.reddit.com/r/funny.json?limit=20', {
                method: "GET"
            })
            .then(res => res.json())
            .then(memes => {
                memes = memes.data.children

                filteredMemes = memes.filter(meme => meme.data.url.includes(".jpg"))

                var item = filteredMemes[Math.floor(Math.random() * filteredMemes.length)];

                message.channel.send(`${item.data.title}\n${item.data.url}`)

            })

    },
};