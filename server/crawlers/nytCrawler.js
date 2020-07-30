const axios = require('axios')

async function nytCrawler(companyName) {
  try {
    let company = 'apple'
    let formattedName = ''
    for (let letter of company) {
      if (letter === " ") {
        continue
      }
      else formattedName += letter
    }

    let oneWeekPrev = new Date()
    let pastDate = oneWeekPrev.getDate() - 7;
    oneWeekPrev.setDate(pastDate)





    console.log(formattedName)
    const data = []
    const apiCall = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${formattedName}&sort=relevance&api-key=${process.env.nyt_key}`)
    const articles = apiCall.data.response.docs
    console.log(articles[0])
    articles.forEach((article) => {
      data.push({
        url: article.web_url
      })
    })
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
module.exports = nytCrawler;


//https://api.nytimes.com/svc/search/v2/articlesearch.json?q=apple&sort=newest&api-key=[YOUR_API_KEY]
