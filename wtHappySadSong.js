const waterfall = require('async').waterfall;

// module.exports = function (context, callback) {

    waterfall([
        function(callback) {
           request.get({
             url: 'http://api.musixmatch.com/ws/1.1/track.search?apikey=' + context.data.MUSIXMATCH_KEY + '&q_track=' + title + '&q_artist=' + artist + '&f_has_lyrics=1'
           }, function(err, response, body) {
               var bodyJSON = JSON.parse(body);
             if (err) {
               return callback(err)


           if (bodyJSON.message.header.status_code != '200') {
             console.dir(bodyJSON);
             return callback({'Error':'Error while invoking musixmatch api'});
           } 
          
          console.dir(bodyJSON);

          if (bodyJSON.message.header.available == '0') {
            return callback({'Error':'Track not found'});
          }

          var trackInfo = bodyJSON.message.body.track_list[0].track;

          callback(null, '1', 'your face');
            } 
          });
        },
        function(arg1, arg2, callback) {
          // arg1 now equals 'one' and arg2 now equals 'two'
            callback(null, 'three');
        },
        function(arg1, callback) {
            // arg1 now equals 'three'
            callback(null, 'done');
        }
    ], function (err, result) {
        // result now equals 'done'
        console.log(result);
    });

    function getTrackId(callback) {
      //     get the track id from musixmatch

    }
    function mySecondFunction(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    }
    function myLastFunction(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }




//           // now invoke the lyric endpt
//           request.get({
//             url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=' + context.data.MUSIXMATCH_KEY + '&track_id=' + trackInfo.track_id
//           }, function(err, response, body) {
//             var bodyJSON = JSON.parse(body)

//             if (err) {
//                 return callback(null, err)
//             } 

//             if (bodyJSON.message.header.status_code != '200') {
//               console.dir(bodyJSON)
//               return callback(null,  {'Error':'Error while invoking musixmatch api'})
//             } 
//              var lyrics = bodyJSON.message.body.lyrics.lyrics_body
//              // remove this warning from the lyrics so it does not impact the score
//              var fixedLyrics = lyrics.replace('******* This Lyrics is NOT for Commercial use *******','')
            
//              // now invoke the twinword endpt
//              request.get({
//                url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/?text=' + fixedLyrics + '&track_id=' + trackInfo.track_id,
//                headers: {
//                     'X-Mashape-Key': context.data.MASHAPE_KEY
//                 },
//              }, function(err, response, body) {
//               var bodyJSON = JSON.parse(body)

//               if (err) {
//                 return callback(null, err)
//               } 

//               if (bodyJSON.result_code != '200') {
//                 console.dir(bodyJSON)
//                 return callback(null,  {'ErrorMessage':'Error while invoking twinword api'})
//               } 

//               console.log(fixedLyrics)

//               var songType = bodyJSON.type
//               var songScore = Math.floor(bodyJSON.score*100)

//               if ('positive' === songType) {
//                 songType = 'happy song'
//               } else if ('negative' === songType) {
//                 songType = 'sad song'
//               } else {
//                 songType = 'neither happy nor sad song'
//               }

//               console.log ('Happy or sad? ' + songType)
//               console.log ('Score? ' + songScore)

//               var result = {
//                   artist: artist,
//                   title: title,
//                   happyOrSad: songType,
//                   songScore: songScore
//               }

//               return callback(null, result)
                
//              })    

           
//           })

//     })
// }
 
// }


