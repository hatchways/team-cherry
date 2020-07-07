const snoowrap = require("snoowrap");

async function redditCrawler(companyName) {
  const scraper = new snoowrap({
    userAgent: process.env.Reddit_userAgent,
    clientId: process.env.Reddit_clientId,
    clientSecret: process.env.Reddit_clientSecret,
    refreshToken: process.env.Reddit_refreshToken,
  });

  const subreddit = await scraper.getSubreddit("all");
  const topPosts = await subreddit.search({
    query: companyName,
    time: "all",
    sort: "relevance",
  });

  let data = [];

  topPosts.forEach((post) => {
    // console.log(post);
    // If a post's title doesn't contain the specified company name, or it doesn't have any content, just ignore it.
    if (post.title.includes(companyName) && post.selftext) {
      // If a post doesn't have a thumbnail picture, set its "thumbnail" to be null.
      if (post.thumbnail.substr(0, 8) !== "https://") {
        post.thumbnail = null;
      }
      data.push({
        id: post.id,
        image: post.thumbnail,
        title: post.title,
        popularity: post.score,
        content: post.selftext,
        date: post.created * 1000, // In Unix time format(in milisecond).
        platform: "Reddit",
      });
    }
  });

  return data;
}

module.exports = redditCrawler;
