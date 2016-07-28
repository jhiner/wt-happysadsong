## Synopsis

This is a simple demo using webtask.io. It uses two services: [musixmatch] (https://developer.musixmatch.com/) and [twinword] (https://www.twinword.com/). You provide a song title and artist, and it will fetch the lyrics (with musixmatch) and analyze them (with twinword) and let you know if it's a "happy" or "sad" song, or maybe neither. 

## Creating the webtask

Assuming you've got the Webtask CLI installed (go [here] (https://webtask.io/docs/wt-cli) for reference), simply create it like this: 

`wt create https://raw.githubusercontent.com/jhiner/wt_happysadsong/master/wtHappySadSong.js --secret MUSIXMATCH_KEY=YOURKEY --secret MASHAPE_KEY=YOURKEY --name happySadSongDemo`

And then invoke it at [this url] (https://webtask.it.auth0.com/api/run/wt-hinerman-gmail_com-0/happySadSongDemo?webtask_no_cache=1&artist=Rush&title=Tom%20Sawyer) https://webtask.it.auth0.com/api/run/wt-hinerman-gmail_com-0/happySadSongDemo?webtask_no_cache=1&artist=Rush&title=Tom%20Sawyer and pass your own artist and title.

For example, here's a particularly sad song: [Losing It by Rush] (https://webtask.it.auth0.com/api/run/wt-hinerman-gmail_com-0/happySadSongDemo?webtask_no_cache=1&artist=Rush&title=Losing%20It)

And a happier song: [Losing It by Rush] (https://webtask.it.auth0.com/api/run/wt-hinerman-gmail_com-0/happySadSongDemo?webtask_no_cache=1&artist=Rush&title=Losing%20It)

## Interpreting the results

It's really rudimentary at this point (could use some fine-tuning), but basically a happy song has a higher "score" than a sad song, all sad songs have a negative score, and all happy songs have a positive score. Note that due to a limitation in the free tier musixmatch api, only a portion of the lyrics will be retrieved and analyzed :-(