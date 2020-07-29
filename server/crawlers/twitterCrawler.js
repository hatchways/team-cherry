const twitter = require("twitter");

async function twitterCrawler(companyName) {
  var client = new twitter({
    consumer_key: "vYce3hIwk9M2p5PhxBPBDalxs",
    consumer_secret: "XMQcxSefGf9jvWsPXBIExZlAUu1Hfh01rj7f9elJkre6BXQiGl",
    bearer_token: "AAAAAAAAAAAAAAAAAAAAABroGAEAAAAArgQru6f3AurVv7EUxAuCV%2FIEAJI%3D8TAOjjbUlVvEg3k8vFaHMqCCd5vULYBfiyI1KrnnJnvB4fcvmW",
  });
  let tweets = await client.get("tweets/search/30day/development", {
    query: companyName,
  });

  let data = [];

  tweets.results.forEach((tweet) => {
    let dateInUnixFormat = Date.parse(tweet.created_at);
    let content = "";

    // If a tweet doesn't have text, we just ignore it.
    if (tweet.extended_tweet) {
      // Get its url, which is the last string in its "text" field.
      let splitText = tweet.text.split(" ");
      let url = splitText[splitText.length - 1];

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
        id: "" + tweet.id,
        // Since most tweets don't have an image and the Twitter APIs don't return an image field,
        // the "image" is set to be null.
        image: null,
        title,
        popularity: tweet.favorite_count,
        content,
        date: dateInUnixFormat, // In Unix time format(in milisecond).
        platform: "Twitter",
        url: url,
        summary: null
      });
    }
  });

  return data;
}

module.exports = twitterCrawler;
