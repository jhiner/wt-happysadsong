'use strict';

const request = require('request');
const rp = require('request-promise');

module.exports = function (context, callback) {

    var title = context.data.title;
    var artist = context.data.artist;

    if (!title || !artist) {
        return callback(null, 'Please provide both artist and title. I will give you back a happy/sad determination and a score')
    } 

    // get the track id from musixmatch
    var options = {
        uri: 'http://api.musixmatch.com/ws/1.1/track.search',
        qs: {
            apikey: context.data.MUSIXMATCH_KEY,
            q_track: title,
            q_artist: artist,
            f_has_lyrics: 1
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };

    // get trackid, then get lyrics, 

    console.log('about to invoke api call to get track id');
    rp(options)
      .then(function (body) {

        var bodyJSON = body; ;

        if (bodyJSON.message.header.status_code != '200') {
          return callback(null,  {'Error':'Error while invoking musixmatch api'});
        } 

        if (bodyJSON.message.header.available == '0') {
         return callback(null, {'Error':'Track not found'});
        }

        var trackInfo = bodyJSON.message.body.track_list[0].track;

        var options = {
            uri: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
            qs: {
                apikey: context.data.MUSIXMATCH_KEY,
                track_id: trackInfo.track_id
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        console.log('about to invoke api call to get lyrics');
        
        return rp(options).then(function (body) {

          var bodyJSON = body;

          if (bodyJSON.message.header.status_code != '200') {
            return callback(null,  {'Error':'Error while invoking musixmatch api'});
          } 

           var lyrics = bodyJSON.message.body.lyrics.lyrics_body;
           // remove this warning from the lyrics so it does not impact the score
           var fixedLyrics = lyrics.replace('******* This Lyrics is NOT for Commercial use *******','');
          
           // now invoke the twinword endpt
           var options = {
               uri: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/',
               qs: {
                   text: fixedLyrics,
                   track_id: trackInfo.track_id
               },
               headers: {
                   'User-Agent': 'Request-Promise',
                   'X-Mashape-Key': context.data.MASHAPE_KEY
               },
               json: true // Automatically parses the JSON string in the response
           };

           console.log('about to invoke api call to analyze lyrics');
           return rp(options).then(function (body) {
          var bodyJSON = body;

          if (bodyJSON.result_code != '200') {
            return callback(null,  {'ErrorMessage':'Error while invoking twinword api'});
          } 

          console.log('lyrics:');
          console.log(fixedLyrics);

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

          var result = {
              artist: artist,
              title: title,
              happyOrSad: songType,
              songScore: songScore
          }

          // return callback(null, result);
          console.dir(result);
        })
        .catch(function (err) {
            // return callback(null, err);
            console.dir(err);
        });
    });
  });      
}