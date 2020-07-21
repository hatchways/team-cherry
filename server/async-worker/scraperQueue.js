const Queue = require('bull');
const { Mention, Company, User, CompanyMentions } = require("../models");
const UserCompanies = require("../models/userCompanies")
const callScraper = require("../scraper");
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

module.exports = async function scraperQueue(loggedInUsers) {
  //Declaring both queues in redis below. asyncMentions adds companies as jobs for companyscraper. Companyscraper does the scraping and adds to db + gets list of users for that company.
  const asyncMentions = new Queue('companies', {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    }
  })

  const companyScraper = new Queue('companyscrape', {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    }
  })

  asyncMentions.add([], { repeat: { cron: ' */10 * * * * *' } })
  //adds a job for scraping each company every so often (set at 10 seconds)

  asyncMentions.process(async () => {
    const companies = await Company.findAll()
    companies.forEach((currentCompany) => {
      companyScraper.add(currentCompany)
      //puts all companies to be scraped in queue in the other job
    })
  });

  companyScraper.process(async (job) => {
    job.data.mentions = await callScraper(job.data.name)
    //gets new mentions from scraper for each company here
  })

  companyScraper.on('completed', async (job, result) => {
    let newMentions = [];

    //listener then adds mentions to db,
    const company = await Company.findByPk(job.data.id)
    for (let m of job.data.mentions) {
      [mention, isNew] = await Mention.findOrCreate({
        where: {
          id: m.id,
        },
        defaults: {
          id: m.id,
          title: m.title,
          platform: m.platform,
          date: m.date,
          content: m.content,
          popularity: m.popularity,
          imageUrl: m.image,
          summary: m.summary,
          url: m.url,
          sentiment: sentiment.analyze(m.title + m.content).comparative
        },
      });

      let existRelationship = await CompanyMentions.findOne({
        where: {
          MentionId: mention.id,
          CompanyId: company.id
        }
      })

      if (!existRelationship) {
        await company.addMention(mention)
        newMentions.push(mention);
      }
    }

    // For each loggin user
    loggedInUsers.forEach(async (user) => {
      // retrieve her companies.
      let companyIds = await UserCompanies.findAll({
        where: {
          UserId: user.userId,
        },
        attributes: ["CompanyId"],
      });

      // Check if this user has this company.
      let hasThisCompany = false;
      for (let i = 0; i < companyIds.length; i++) {
        if (companyIds[i]["CompanyId"] == job.data.id) {
          hasThisCompany = true;
          break;
        }
      }

      // If she has, we filter out mentions that match her keywords and platform selected.
      // Then send the filtered mentions to FE via websocket.
      if (hasThisCompany) {
        let filteredMentions = newMentions.filter((mention) => {
          return (
            (mention.title.includes(user.keywords) ||
              mention.content.includes(user.keywords)) &&
            user.platformSelected.includes(mention.platform)
          );
        });
        if (filteredMentions.length > 0) {
          user.socket.emit("newMentions", filteredMentions);
        }
      }
    });

    //and gets users associated with company put in array
    const users = await User.findAll({
      include: [{
        model: Company,
        where: { id: job.data.id }
      }],
    })
    // console.log(job.data.name, users)
  })
  //this might not be neccesary, but shows that jobs were added
  // asyncMentions.on('completed', (job, result) => {
  //   console.log('companies added to companyscraper')
  // })
}
