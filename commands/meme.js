const fetch = require('node-fetch')

module.exports = {
    name: 'meme',
    description: 'Display a random meme!',
    execute(message, args) {

        let loadingMessages = ['Fetching quality memage...', 'Generating meme...', 'Meme incoming...', 'Loading the dankest of memes...']

        let loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

        message.channel.send(`${loadingMessage}`)

        fetch('https://www.reddit.com/r/memes.json?limit=20', {
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