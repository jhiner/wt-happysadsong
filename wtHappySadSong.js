'use strict'; 

const request = require('request');
const waterfall = require('async').waterfall;

module.exports = function (wtContext, wtCallback) {

    waterfall([
        function(callback) {

          var title = wtContext.data.title;
          var artist = wtContext.data.artist;

           request.get({
             url: 'http://api.musixmatch.com/ws/1.1/track.search?apikey=' + wtContext.data.MUSIXMATCH_KEY + '&q_track=' + title + '&q_artist=' + artist + '&f_has_lyrics=1'
           }, function(err, response, body) {
            callback(err, body);
           });
        },
        function(body, callback) {
          console.log('got a response from MM API');
           var bodyJSON = JSON.parse(body);
           if (bodyJSON.message.header.status_code != '200') {
             console.dir(bodyJSON);
             callback({'Error':'Error while invoking musixmatch api'});
           } 
          
          if (bodyJSON.message.header.available == '0') {
            callback({'Error':'Track not found'});
          }
          var trackInfo = bodyJSON.message.body.track_list[0].track;

          // now invoke the lyric endpt
          request.get({
            url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=' + wtContext.data.MUSIXMATCH_KEY + '&track_id=' + trackInfo.track_id
          }, function(err, response, body) {
            callback(err, trackInfo, body);
          });
        },
        function(trackInfo, body, callback) {
            var bodyJSON = JSON.parse(body);

            if (bodyJSON.message.header.status_code != '200') {
              callback( {'Error':'Error while invoking musixmatch api'});
            } 

             var lyrics = bodyJSON.message.body.lyrics.lyrics_body;
             // remove this warning from the lyrics so it does not impact the score
             var fixedLyrics = lyrics.replace('******* This Lyrics is NOT for Commercial use *******','');
            
             // now invoke the twinword endpt
             request.get({
               url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/?text=' + fixedLyrics + '&track_id=' + trackInfo.track_id,
               headers: {
                    'X-Mashape-Key': wtContext.data.MASHAPE_KEY
                },
             }, function(err, response, body) {
                callback(err, fixedLyrics, body);
            });
        },
        function(fixedLyrics, body, callback) {
          var bodyJSON = JSON.parse(body);

          if (bodyJSON.result_code != '200') {
            return callback(null,  {'ErrorMessage':'Error while invoking twinword api'});
          } 

          console.log(fixedLyrics)

          var songType = bodyJSON.type;
          var songScore = Math.floor(bodyJSON.score*100);

          if ('positive' === songType) {
            songType = 'happy song';
          } else if ('negative' === songType) {
            songType = 'sad song';
          } else {
            songType = 'neither happy nor sad song';
          }

          console.log ('Happy or sad? ' + songType);
          console.log ('Score? ' + songScore);

          var title = wtContext.data.title;
          var artist = wtContext.data.artist;

          var result = {
              artist: artist,
              title: title,
              happyOrSad: songType,
              songScore: songScore
          };

          callback(null, result);
        }
    ], function (err, result) {

        // result now equals 'done'
        if (err) {
          wtCallback(err);
          console.log(err);
         }
        console.log(result);
        wtCallback(null, result);
    });
}