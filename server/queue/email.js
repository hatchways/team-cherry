const Queue = require('bull');
const nodemailer = require('nodemailer');


const createEmailQueue = () => {

  const weeklyEmailQueue = new Queue('sendMail', { //Make sure redis is set on your end. default port should be 6379
    //this creates a queue in redis called sendmail, the value of sendmail is the configuration of the queue
    redis: {
      host: '127.0.0.1',
      port: 6379,
    }
  });

  const emails = dbEmails//emails would be every email in db.

  weeklyEmailQueue.add(emails, { repeat: { cron: ' */10 * * * * *' } });
  /*This is a job. Parameters are items for worker func to process the job, and the configuration for when job should be repeated. Right now it is set up to repeat every minute */

  weeklyEmailQueue.process(job => {
    const emailArr = job.data
    emailArr.forEach((email) => {
      console.log(email)
      sendMail(email);
    })
  });

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
        pass: 'P455w0rd'
      }
    };
    nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        console.log('success')
        resolve(info);
      }
    });
  }

}

module.exports = { createEmailQueue };
/* this is the worker / processor above. This carries out the job*/



// add bull listener
