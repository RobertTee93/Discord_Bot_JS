const fetch = require('node-fetch')

module.exports = {
    name: 'reddit',
    description: 'Display a random image from a given reddit!',
    args: true,
    usage: '<subReddit>',
    execute(message, args) {

        let loadingMessages = ['Looking for images...', 'Getting pics...', 'Doing bot stuff...']

        let loadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

        message.channel.send(`${loadingMessage}`)

        fetch(`https://www.reddit.com/r/${args[0]}.json?limit=30`, {
                method: "GET"
            })
            .then(res => res.json())
            .then(posts => {
                posts = posts.data.children

                filteredPosts = posts.filter(meme => meme.data.url.includes(".jpg"))

                if(filteredPosts.length > 0){
                    var item = filteredPosts[Math.floor(Math.random() * filteredPosts.length)];

                    message.channel.send(`${item.data.title}\n${item.data.url}`)
                } else {

                    message.channel.send(`Sorry no images found for that subreddit...`)

                }

            })

    },
};