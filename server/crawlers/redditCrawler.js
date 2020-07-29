const snoowrap = require("snoowrap");

async function redditCrawler(companyName) {
  const scraper = new snoowrap({
    userAgent: "A random string",
    clientId: "Sg2CMs5WPfvvQg",
    clientSecret: "Aa_PoLpV0n7Jz-i-PeFbhWfGLvk",
    refreshToken: "404869046306-cbx4wyQaNuYznytlQiv-WIBUaN4",
  });

  const subreddit = await scraper.getSubreddit("all");
  const topPosts = await subreddit.search({
    query: companyName,
    time: "all",
    sort: "relevance",
  });

  // const subreddit = await scraper.getSubreddit("hearthstone");
  // const topPosts = await subreddit.getNew();

  let data = [];

  topPosts.forEach((post) => {
    // console.log(post);

    // If a post doesn't have a thumbnail picture, set its "thumbnail" to be null.
    if (post.thumbnail.substr(0, 8) !== "https://") {
      post.thumbnail = null;
    }

    // Next, we extract a summary from the content.
    // Split the content into words, and find the index of the first word that contains the specified company name.
    let splitContent = post.selftext.split(" ");
    let indexOfCompanyName = -1;
    for (let i = 0; i < splitContent.length; i++) {
      if (
        splitContent[i].toLowerCase().includes(companyName.toLowerCase())
      ) {
        indexOfCompanyName = i;
        break;
      }
    }

    let summary = "";
    // The content of this post doesn't contain the company name, so there is no summary for it.
    if (indexOfCompanyName === -1) {
      summary = null;
    }
    else {
      // We back track by 10 words from the first occurence of the company name, stopping at the beginning of the content.
      // And if we didn't reach the beginning of the content, we add ellipsis at the beginning of the title.
      let startingEllipsis = "...";
      let startIndex = indexOfCompanyName - 30;
      if (startIndex < 0) {
        startIndex = 0;
        startingEllipsis = "";
      }

      // We track forwards by 10 words from the first occurence of the company name, stopping at the end of the content.
      // And if we didn't reach the end of the content, we add ellipsis at the end of the title.
      let endingEllipsis = "...";
      let endIndex = indexOfCompanyName + 30;
      if (endIndex >= splitContent.length) {
        endIndex = splitContent.length - 1;
        endingEllipsis = "";
      }

      // Add all words together to form the title, from 10 words ahead of the company name to 10 words behind it.
      for (let i = startIndex; i <= endIndex; i++) {
        summary += splitContent[i];
        if (i != endIndex) {
          summary += " ";
        }
      }

      // Add the ellipsis to the beginning and end of the title.
      summary = startingEllipsis + summary + endingEllipsis;
    }

    data.push({
      id: post.id,
      image: post.thumbnail,
      title: post.title,
      popularity: post.score,
      content: post.selftext,
      date: post.created * 1000, // In Unix time format(in milisecond).
      platform: "Reddit",
      url: "https://www.reddit.com" + post.permalink,
      summary: summary
    });
    // }
  });

  return data;
}

module.exports = redditCrawler;
