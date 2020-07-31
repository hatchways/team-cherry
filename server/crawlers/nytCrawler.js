const axios = require('axios')
const moment = require('moment')
async function nytCrawler(companyName) {
  try {
    const today = moment().format('L')
    let formattedArray = today.split('/')
    let formattedCurrDate = formattedArray[2] + formattedArray[0] + formattedArray[1]

    const oneWeekPrev = moment().subtract(10, 'days').calendar()
    let oneWeekFormattedArray = oneWeekPrev.split('/')
    let formattedPrevDate = oneWeekFormattedArray[2] + oneWeekFormattedArray[0] + oneWeekFormattedArray[1]

    //formatting company name in case there's spaces
    let formattedName = ''
    for (let letter of companyName) {
      if (letter === " ") {
        continue
      }
      else formattedName += letter
    }

    const data = []
    const apiCall = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${formattedPrevDate}&end_date=${formattedCurrDate}&q=${formattedName}&sort=relevance&api-key=${process.env.nyt_key}`)
    const articles = apiCall.data.response.docs
    articles.forEach((article) => {
      const mention = {
        // id: article._id,
        title: article.headline.main,
        popularity: 100,
        content: article.lead_paragraph,
        date: article.pub_date,
        platform: "The New York Times",
        url: article.web_url,
        summary: article.lead_paragraph
      }
      const articleId = article._id.slice(14)
      mention.id = articleId
      if (!article.multimedia[0]) {
        mention.image = null
      }
      else mention.image = `https://static01.nyt.com/${article.multimedia[0].url}`
      data.push(mention)
    })
    return data
  } catch (error) {
    console.error(error)
  }
}
module.exports = nytCrawler;


//https://api.nytimes.com/svc/search/v2/articlesearch.json?q=apple&sort=newest&api-key=[YOUR_API_KEY]
