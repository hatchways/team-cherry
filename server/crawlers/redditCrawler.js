const snoowrap = require("snoowrap");

async function redditCrawler(companyName, numOfMentionsToObtain) {
  const scraper = new snoowrap({
    userAgent: process.env.Reddit_userAgent,
    clientId: process.env.Reddit_clientId,
    clientSecret: process.env.Reddit_clientSecret,
    refreshToken: process.env.Reddit_refreshToken,
  });

  const subreddit = await scraper.getSubreddit("all");
  const topPosts = await subreddit.getTop({
    time: "all",
    limit: numOfMentionsToObtain,
  });

  let data = [];

  topPosts.forEach((post) => {
    // If a post doesn't have any content, just ignore it.
    if (post.title.includes(companyName) && post.selftext) {
      // If a post doesn't have a thumbnail picture, just use Reddit's logo.
      if (post.thumbnail.substr(0, 8) !== "https://") {
        post.thumbnail = "/imgs/reddit_icon.png";
      }
      data.push({
        image: post.thumbnail,
        title: post.title,
        popularity: post.score,
        content: post.selftext,
        date: post.created, // In Unix time format(in milisecond).
        platform: "Reddit",
      });
    }
  });

  return data;
}

module.exports = redditCrawler;
