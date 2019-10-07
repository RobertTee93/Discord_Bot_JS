const fetch = require('node-fetch')
const htmlToJson = require('html-to-json')

module.exports = {
    name: 'score',
    description: 'Gives all live football scores, or search by team (!score man u).',
    usage: '<team-name>',
    execute(message, args) {

        let team = null

        if(args){
            team = args.join(" ")
        }

        fetch(`https://www.bbc.co.uk/sport/football/scores-fixtures`)
        .then(result => result.text())
        .then(result => {
          htmlToJson.parse(result, {
            'text': function ($doc) {
                return $doc.find('article');
            }
          })
          .then(res => {
              console.log(res.text.length)
    
              let matches = res.text
    
              let matchesArray = []
    
              for(let i = 0; i < res.text.length; i++){
                  if(matches[i].attribs.class === "sp-c-fixture"){
                      matchesArray.push(matches[i])
                  }
              }
    
            //   console.log(matchesArray[24].children[1].children[0].children[1].children[1].attribs.title)
    
              sortedMatches = matchesArray.map(match => {
    
                let startTime = null
                let homeTeam = null
                let homeScore = null
                let awayTeam = null
                let awayScore = null
                let minsPlayed = ""
    
                if(match.children[0].children[2].children[0].children[0].children[0].attribs){
                    homeTeam = match.children[0].children[0].children[0].children[0].children[0].attribs.title
                    homeScore = match.children[0].children[0].children[1].children[0].children[0].data
                    awayTeam = match.children[0].children[2].children[0].children[0].children[0].attribs.title
                    awayScore = match.children[0].children[2].children[1].children[0].children[0].data
                } else {
                    startTime = match.children[0].children[1].children[0].children[0].data
                    awayTeam = match.children[0].children[2].children[0].children[0].children[0].data
                    homeTeam = match.children[0].children[0].children[0].children[0].children[0].data
                }


            

                if(minsPlayed){
                    console.log(minsPlayed)
                }
    
                return {
                    homeTeam: homeTeam,
                    homeScore: homeScore || '0',
                    awayTeam: awayTeam,
                    awayScore: awayScore || '0',
                    startTime: startTime || "---"
                }
                  
              })
    
            //   if(team){
            //     sortedMatches = sortedMatches.filter(match => match.homeTeam.toLowerCase().includes(team.toLowerCase()) || match.awayTeam.toLowerCase().includes(team.toLowerCase()))
            //   }
    
            //   if(sortedMatches.length > 0){
            //     sortedMatchesScores = sortedMatches.map(match => {
            //         return `\n⚽️${match.startTime} ${match.homeTeam} ${match.homeScore} ${match.awayScore} ${match.awayTeam}`
            //     })

            //     if(sortedMatchesScores.join("").length > 2000){

            //     }

            //     message.channel.send(`\`\`\`${sortedMatchesScores}\`\`\``);
            //   } else {
            //     console.log("NO MATCHES FOUND")
            //     message.channel.send(`No matches found!`);
            //   }
              
          })
        })
        .catch(err => console.log(err)) 
    },
};


