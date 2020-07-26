const Queue = require('bull');
const { User, Company, Mention } = require("../models");
const axios = require('axios')
const { setQueues } = require('bull-board')
//Task queue for emailing

module.exports = async function emailQueue() {
  const getEmails = new Queue('getEmails', {
    //Make sure redis is set / installed on your end. default port should be 6379
    //this creates a queue in redis called sendmail, the value of sendmail is the configuration of the queue
    redis: {
      host: '127.0.0.1',
      port: 6379,
    }
  });

  const sendEmail = new Queue('sendEmail', {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    }
  })


  getEmails.add([], { repeat: { cron: '0 0 * * Sun' } });
  /*This is a job. Parameters are items for worker func to process the job, and the configuration for when job should be repeated.*/

  getEmails.process(async () => {
    try {
      const emails = await User.findAll({
        attributes: ['subscriberEmail', 'id']
      })
      emails.forEach(async (email) => {
        await sendEmail.add(email)
      })
      return emails
    } catch (error) {
      console.error(error)
    }
  })
  /* this is the worker / processor above. This carries out the job*/

  const send = async (address, mentions) => {
    let config = {
      headers: {
        Authorization: `Bearer ${process.env.sendgridKey}`,
      }
    }
    let data = {
      personalizations: [
        {
          to: [
            {
              email: `${address}`,
            },
          ],
          dynamic_template_data: {
            allMentions: mentions,
          }
        }
      ],
      from: {
        email: "mentionscrawler123@gmail.com",
        name: "Mentionscrawler Team"
      },
      template_id: "d-27ed250c5d114b5da59c3023eb45d0c8",
    }
    try {
      await axios.post("https://api.sendgrid.com/v3/mail/send", data, config)
    } catch (error) {
      console.error(error, 'failing here>>>>>>>')
    }
  }


  sendEmail.process(async (job) => {
    const companyMentions = {}
    let oneWeekPrev = new Date()
    let pastDate = oneWeekPrev.getDate() - 7;


    oneWeekPrev.setDate(pastDate)
    //get all companies here
    const companies = await Company.findAll({
      include: [{
        model: User,
        where: { id: job.data.id }
      }]
    })
    for (let company of companies) {
      companyMentions[company.name] = []
      let mentions = await company.getMentions({
        attributes: ['title', 'content', 'date', 'imageUrl', 'popularity', 'platform'],
        include: [{ model: Company }],
        order: [["popularity", "DESC"]],
      })
      mentions = mentions.map(current => {
        let currentObj = {
          title: current.title,
          content: current.content || "",
          date: current.date,
          imageUrl: current.imageUrl || "",
          platform: current.platform
        }
        return currentObj
      })

      //get all mentions
      companyMentions[company.name] = companyMentions[company.name].concat(mentions)

      //sort by popularity
      companyMentions[company.name] = companyMentions[company.name].sort((a, b) => {
        return b.popularity - a.popularity
      })

      //get rid of ones dated before last week
      companyMentions[company.name] = companyMentions[company.name].filter((current) => {
        return current.date > oneWeekPrev
      })
      //cut down to 10
      if (companyMentions[company.name].length > 10) {
        companyMentions[company.name] = companyMentions[company.name].slice(0, 10)
      }
    }
    send(job.data.subscriberEmail, companyMentions)
  })


  sendEmail.on('completed', async (job, result) => {
    console.log(`newsletter sent to ${job.data.subscriberEmail} `)
  })
  setQueues([getEmails, sendEmail])

}
