const axios = require('axios')

async function nytCrawler(companyName) {
  try {

    //formatting company name in case there's spaces
    let formattedName = ''
    for (let letter of companyName) {
      if (letter === " ") {
        continue
      }
      else formattedName += letter
    }

    //setting dates for one week prev and today to fit nyt api convention
    let oneWeekPrev = new Date()
    let pastDate = oneWeekPrev.getDate() - 7;
    oneWeekPrev.setDate(pastDate)
    const prevYear = oneWeekPrev.getFullYear().toString()
    let convertedPrevMonth = (oneWeekPrev.getMonth() + 1).toString()
    if (convertedPrevMonth.length === 1) {
      convertedPrevMonth = `0${convertedPrevMonth}`
    }
    let convertedPrevDay = oneWeekPrev.getDate().toString()
    if (convertedPrevDay.length === 1) {
      convertedPrevDay = `0${convertedPrevDay}`
    }
    let formattedPrevDate = prevYear + convertedPrevMonth + convertedPrevDay

    let today = new Date()
    const currentYear = today.getFullYear().toString()
    let convertedCurrMonth = (today.getMonth() + 1).toString()
    if (convertedCurrMonth.length === 1) {
      convertedCurrMonth = `0${convertedCurrMonth}`
    }
    let convertedCurrDay = today.getDate().toString()
    if (convertedCurrDay.length === 1) {
      convertedCurrDay = `0${convertedCurrDay}`
    }
    let formattedCurrDate = currentYear + convertedCurrMonth + convertedCurrDay


    const data = []
    const apiCall = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${formattedPrevDate}&end_date=${formattedCurrDate}&q=${formattedName}&sort=relevance&api-key=${process.env.nyt_key}`)
    const articles = apiCall.data.response.docs
    articles.forEach((article) => {
      const mention = {
        id: article._id,
        title: article.headline.main,
        popularity: 100,
        content: article.lead_paragraph,
        date: article.pub_date,
        platform: article.source,
        url: article.web_url,
        summary: article.lead_paragraph
      }
      // image: `https://static01.nyt.com/${article.multimedia[0].url}`,
      if (!article.multimedia[0]) {
        mention.image = ''
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
