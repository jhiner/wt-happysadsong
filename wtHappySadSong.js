var request = require('request')

module.exports = function (context, callback) {

    var title = context.data.title
    var artist = context.data.artist

    if (!title || !artist) {
        return callback(null, 'Please provide both artist and title. I will give you back a happy/sad determination and a happy/sad')
    } 

    // get the track id from musixmatch
    request.get({
      url: 'http://api.musixmatch.com/ws/1.1/track.search?apikey=' + context.data.MUSIXMATCH_KEY + '&q_track=' + title + '&q_artist=' + artist + '&f_has_lyrics=1'
    }, function(err, response, body) {
        var bodyJSON = JSON.parse(body)
      if (err) {
        return callback(null, err)
      } 

      if (bodyJSON.message.header.status_code != '200') {
        console.dir(bodyJSON)
        return callback(null,  {'Error':'Error while invoking musixmatch api'})
      } 

          var trackInfo = bodyJSON.message.body.track_list[0].track
          
          // now invoke the lyric endpt
          request.get({
            url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=' + context.data.MUSIXMATCH_KEY + '&track_id=' + trackInfo.track_id
          }, function(err, response, body) {
            var bodyJSON = JSON.parse(body)

            if (err) {
                return callback(null, err)
            } 

            if (bodyJSON.message.header.status_code != '200') {
              console.dir(bodyJSON)
              return callback(null,  {'Error':'Error while invoking musixmatch api'})
            } 
             var lyrics = bodyJSON.message.body.lyrics.lyrics_body
            
             // now invoke the twinword endpt
             request.get({
               url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/?text=' + lyrics + '&track_id=' + trackInfo.track_id,
               headers: {
                    'X-Mashape-Key': context.data.MASHAPE_KEY
                },
             }, function(err, response, body) {
              var bodyJSON = JSON.parse(body)

              if (err) {
                return callback(null, err)
              } 

              if (bodyJSON.result_code != '200') {
                console.dir(bodyJSON)
                return callback(null,  {'ErrorMessage':'Error while invoking twinword api'})
              } 

              var songType = bodyJSON.type
              var songPercentage = Math.floor(bodyJSON.score*100) + '%'

              if ('positive' === songType) {
                songType = 'happy song'
              } else if ('negative' === songType) {
                songType = 'sad song'
              } else {
                songType = 'neither happy nor sad song'
              }

              console.log ('Happy or sad? ' + songType)
              console.log ('Score? ' + songPercentage)

              var result = {
                  happyOrSad: songType,
                  scorePercentage: songPercentage
              }

              return callback(null, result)
                
             })    

           
          })

    })
}