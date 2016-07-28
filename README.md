## Synopsis

This is a simple demo using webtask.io. It uses two services: [musixmatch] (https://developer.musixmatch.com/) and [twinword] (https://www.twinword.com/). You provide a song title and artist, and it will fetch the lyrics (with musixmatch) and analyze them (with twinword) and let you know if it's a "happy" or "sad" song, or maybe neither. 

## Creating the webtask

Assuming you've got the Webtask CLI installed (go [here] (https://webtask.io/docs/wt-cli) for reference), simply create it like this: 

`wt create https://raw.githubusercontent.com/jhiner/wt_happysadsong/master/wtHappySadSong.js --secret MUSIXMATCH_KEY=YOURKEY --secret MASHAPE_KEY=YOURKEY --name happySadSongDemo`

And then invoke it at [this url] (https://webtask.it.auth0.com/api/run/wt-hinerman-gmail_com-0/happySadSongDemo?webtask_no_cache=1&artist=Rush&title=Tom%20Sawyer) https://webtask.it.auth0.com/api/run/wt-hinerman-gmail_com-0/happySadSongDemo?webtask_no_cache=1&artist=Rush&title=Tom%20Sawyer and pass your own artist and title.