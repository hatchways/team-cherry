const Queue = require('bull');
const { User } = require("../models");
const nodemailer = require("nodemailer");

//Task queue for emailing
module.exports = async function emailQueue() {
  const weeklyEmailQueue = new Queue('sendMail', {
    //Make sure redis is set / installed on your end. default port should be 6379
    //this creates a queue in redis called sendmail, the value of sendmail is the configuration of the queue
    redis: {
      host: '127.0.0.1',
      port: 6379,
    }
  });


  const getEmails = async () => {
    try {
      const emails = await User.findAll({
        attributes: ['subscriberEmail',]
      })
      return emails
    } catch (error) {
      console.error(error)
    }
  }

  weeklyEmailQueue.add([], { repeat: { cron: ' */10 * * * * *' } });
  /*This is a job. Parameters are items for worker func to process the job, and the configuration for when job should be repeated. Right now it is set up to repeat every minute */



  weeklyEmailQueue.process(async () => {
    try {
      const data = await getEmails()
      const emails = []
      data.forEach((current) => {
        emails.push(current.dataValues.subscriberEmail)
      })
      emails.forEach((email) => {
        sendMail(email);
      })
    } catch (error) {
      console.error(error)
    }
  });
  /* this is the worker / processor above. This carries out the job*/


  function sendMail(email) {
    let mailOptions = {
      to: `${email}`,
      subject: 'Your weekly mentionscrawlers newsletter updated',
      text: "Sent from cherry",
    };
    let mailConfig = {
      service: 'gmail',
      auth: {
        user: 'mentionscrawler123@gmail.com',
        pass: process.env.mentionsCrawlerPW
      }
    };
    nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
      } else {
        console.log('success')
        resolve(info);
      }
    });
  }
}
