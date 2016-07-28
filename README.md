## Synopsis

This is a simple demo of using webtask. It uses two services: [musixmatch] (https://developer.musixmatch.com/) and [twinword] (https://www.twinword.com/). You provide a song title and artist, and it will fetch the lyrics (with musixmatch) and analyze them (with twinword) and let you know if it's a "happy" or "sad" song, or maybe neither. 

## Creating the webtask

Assuming you've got the Webtask CLI installed (go [here] (https://webtask.io/docs/wt-cli) for reference), simply create it like this: 
wt create (github url for wtHappySadSong.js) --secret MUSIXMATCH_KEY=(your musixmatch api key) --secret MASHAPE_KEY=(your mashape api key) --name happySadSongDemo
