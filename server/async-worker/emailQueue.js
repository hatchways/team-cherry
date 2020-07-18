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


  getEmails.add([], { repeat: { cron: ' */10 * * * * *' } });
  /*This is a job. Parameters are items for worker func to process the job, and the configuration for when job should be repeated. Right now it is set up to repeat every minute */

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

  const obj = {
    subject: "Your weekly mentioncrawler newsletter",
    heading: "Hey! Below are your mentions for this week.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  };

  let htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <body>
        <h1>${obj.heading}</h1>
        <a href="default.asp">
        <img src=${obj.image} alt="HTML tutorial" style="width:200px;height:200px;border:0">
        </a>
        <p>${obj.description}</p>
        </body>
        </html>
`;
  const send = async (address) => {
    try {
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
            subject: "Your Weekly Updates from Mentionscrawler"
          }
        ],
        from: {
          email: "mentionscrawler123@gmail.com",
          name: "Mentionscrawler Team"
        },
        content: [{ type: "text/html", value: htmlTemplate }]
      }
      await axios.post("https://api.sendgrid.com/v3/mail/send", data, config)
    } catch (error) {
      console.error('failing here>>>>>>>')
    }
  }

  // const result = await A.findOne({
  //   include: {
  //     model: B,
  //     include: {
  //       model: C,
  //       where: {
  //         c_columnName: {
  //           [Op.col]: 'B.b_columnName',
  //         },
  //       }
  //     },
  //   },
  // });
  sendEmail.process(async (job) => {
    // await send(job.data.subscriberEmail)

    job.data.allMentions = []
    const companies = await Company.findAll({
      include: [{
        model: User,
        where: { id: job.data.id }
      }]
    })
    console.log(companies)
    for (let company of companies) {
      let mentions = await company.getMentions()
      job.data.allMentions = job.data.allMentions.concat(mentions)
    }

    // for (let company of companies) {
    //   let mentions = await company.getMentions()
    //   job.data.allMentions = job.data.allMentions.concat(mentions)
    // }


  })
  sendEmail.on('completed', async (job, result) => {
    console.log(job.data.allMentions)
    console.log('email sent', job.data.subscriberEmail)
  })
  setQueues([getEmails, sendEmail])
  // function sendMail(email) {
  //   let mailOptions = {
  //     to: `${email}`,
  //     subject: 'Your weekly mentionscrawlers newsletter updated',
  //     text: "Sent from cherry",
  //   };
  //   let mailConfig = {
  //     service: 'gmail',
  //     auth: {
  //       user: 'mentionscrawler123@gmail.com',
  //       pass: 'will put pw in slack'
  //     }
  //   };
  //   nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
  //     if (err) {
  //       console.log(err)
  //     } else {
  //       console.log('success')
  //       resolve(info);
  //     }
  //   });
  // }
}
