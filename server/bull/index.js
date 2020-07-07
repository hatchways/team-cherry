const Queue = require('bull');
const nodemailer = require('nodemailer');


const weeklyEmailQueue = new Queue('sendMail', { //Make sure redis is set on your end. default port should be 6379
  //this creates a queue in redis called sendmail, the value of sendmail is the configuration of the queue
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
});

const emails = []//emails would be every email in db.

weeklyEmailQueue.add(emails, { repeat: { cron: '* * * * *' } });
/*This is a job. Parameters are items for worker func to process the job, and the configuration for when job should be repeated. Right now it is set up to repeat every minute */


weeklyEmailQueue.process((job) => {
  const emailArr = job.data
  emailArr.forEach((email) => {
    sendMail(email);
  })
});
/* this is the worker / processor above. This carries out the job*/


function sendMail(email) {
  let mailOptions = {
    from: '',
    to: `${email}`,
    subject: 'Your weekly webcrawler newsletter',
    text: "Sent from cherry",
  };
  let mailConfig = {
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  };
  nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
    if (err) {
      return err
    } else {
      console.log('sucessful send', info)
    }
  });
}
