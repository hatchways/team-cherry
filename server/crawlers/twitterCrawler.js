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

    // If a tweet doesn't have text, we jus ignore it.
    if (tweet.extended_tweet) {
      content = tweet.extended_tweet.full_text;

      // Make the content in one line so we can take a part of it as the title.
      let contentInOneLine = content.replace(/\n/g, " ");

      // Split the content into words, and find the index of the first word that contains the specified company name.
      let wordsInContent = contentInOneLine.split(" ");
      let indexOfCompanyName = 0;
      for (let i = 0; i < wordsInContent.length; i++) {
        if (
          wordsInContent[i].toLowerCase().includes(companyName.toLowerCase())
        ) {
          indexOfCompanyName = i;
          break;
        }
      }

      // We back track by 4 words from the first occurence of the company name, stopping at the beginning of the content.
      // And if we didn't reach the beginning of the content, we add ellipsis at the beginning of the title.
      let startingEllipsis = "...";
      let startIndex = indexOfCompanyName - 4;
      if (startIndex < 0) {
        startIndex = 0;
        startingEllipsis = "";
      }

      // We track forwards by 4 words from the first occurence of the company name, stopping at the end of the content.
      // And if we didn't reach the end of the content, we add ellipsis at the end of the title.
      let endingEllipsis = "...";
      let endIndex = indexOfCompanyName + 4;
      if (endIndex >= wordsInContent.length) {
        endIndex = wordsInContent.length - 1;
        endingEllipsis = "";
      }

      // Add all words together to form the title, from 4 words ahead of the company name to 4 words behind it.
      let title = "";
      for (let i = startIndex; i <= endIndex; i++) {
        title += wordsInContent[i];
        if (i != endIndex) {
          title += " ";
        }
      }

      // Add the ellipsis to the beginning and end of the title.
      title = startingEllipsis + title + endingEllipsis;

      data.push({
        id: tweet.id,
        image: "/imgs/twitter_icon.png",
        title,
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
