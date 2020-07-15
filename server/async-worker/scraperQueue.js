const Queue = require('bull');
const { Mention, Company, User } = require("../models");
const callScraper = require("../scraper");


//Declaring both queues in redis. WeeklyMentions adds companies as jobs for companyscraper. Companyscraper does the scraping and adds to db + gets list of users for that company.

module.exports = async function scraperQueue() {
  // //Declaring both queues in redis. WeeklyMentions adds companies as jobs for companyscraper. Companyscraper does the scraping and adds to db + gets list of users for that company.
  // const weeklyMentions = new Queue('companies', {
  //   redis: {
  //     host: '127.0.0.1',
  //     port: 6379,
  //   }
  // })

  // const companyScraper = new Queue('companyscrape', {
  //   redis: {
  //     host: '127.0.0.1',
  //     port: 6379,
  //   }
  // })

  // weeklyMentions.add([], { repeat: { cron: ' */10 * * * * *' } })
  // //adds a job to be done for each company every so often (set at 10 seconds)

  // weeklyMentions.process(async () => {
  //   const companies = await Company.findAll()
  //   companies.forEach((currentCompany) => {
  //     companyScraper.add(currentCompany)
  //     //puts all companies to be scraped in queue in the other job
  //   })
  // });

  // companyScraper.process(async (job) => {
  //   job.data.mentions = await callScraper(job.data.name)
  //   //gets new mentions from scraper for each company here
  // })

  // companyScraper.on('completed', async (job, result) => {
  //   //listener then adds mentions to db,
  //   const company = await Company.findByPk(job.data.id)
  //   for (let m of job.data.mentions) {
  //     [mention, isNew] = await Mention.findOrCreate({
  //       where: {
  //         id: m.id,
  //       },
  //       defaults: {
  //         id: m.id,
  //         title: m.title,
  //         platform: m.platform,
  //         date: m.date,
  //         content: m.content,
  //         popularity: m.popularity,
  //         imageUrl: m.image,
  //       },
  //     });
  //     await company.addMention(mention)
  //   }
  //   //and gets users associated with company put in array
  //   const users = await User.findAll({
  //     include: [{
  //       model: Company,
  //       where: { id: job.data.id }
  //     }],
  //   })
  //   console.log(job.data.name, users)
  // })

  // weeklyMentions.on('completed', (job, result) => {
  //   console.log('companies successfully scraped')
  // })
}
