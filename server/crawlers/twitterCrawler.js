const twitter = require("twitter");

async function twitterCrawler(companyName) {
  var client = new twitter({
    consumer_key: process.env.Twitter_consumer_key,
    consumer_secret: process.env.Twitter_consumer_secret,
    bearer_token: process.env.Twitter_bearer_token,
  });

  let tweets = await client.get("tweets/search/30day/dev", {
    query: companyName,
  });

  let data = [];

  tweets.results.forEach((tweet) => {
    let dateInUnixFormat = Date.parse(tweet.created_at);
    let content = "";

    if (tweet.extended_tweet) {
      content = tweet.extended_tweet.full_text;
      data.push({
        image: "/imgs/twitter_icon.png",
        title: "",
        popularity: tweet.favorite_count,
        content,
        date: dateInUnixFormat, // In Unix time format(in milisecond).
        platform: "Twitter",
      });
    }
  });

  return data;
}

module.exports = twitterCrawler;
