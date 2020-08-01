const axios = require('axios');
const moment = require('moment');

// url params
const lastWeek = moment().subtract(1, 'weeks').format('YYYY-DD-MM');
const sources =
  'business-insider,cnn,abc-news,ars-technica,associated-press,cbs-news,engadget,fortune,hacker-news,techcrunch';
const pageSize = 100;
const page = 1;
const key = process.env.newsApiKey;

const createEndpoint = (company, source) =>
  `http://newsapi.org/v2/everything?q=${company}&sources=${source}&from=${lastWeek}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${key}`;

module.exports = async function newsApiScrape(company) {
  let output = [];
  let url = createEndpoint(company, sources);
  let {
    data: { articles },
  } = await axios.get(url);

  output = articles.map((article) => {
    const destructuredUrl = article.url.split('/');
    // get the last portion of the destructured url and use it as the mention's id
    const [id] = destructuredUrl.slice(-1);
    return {
      id,
      image: article.urlToImage,
      title: article.title,
      content: article.content,
      date: article.publishedAt,
      platform: article.source.name,
      url: article.url,
      popularity: 0, // temporary val
      summary: article.description.replace(/(<([^>]+)>)/gi, '').trim(), // need to relieve html tagging and extra white space
    };
  });

  return output;
};
