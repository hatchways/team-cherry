const Queue = require('bull');
const { User } = require("../models");
const nodemailer = require("nodemailer");
const axios = require('axios')

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
        sendEmail(email);
      })
    } catch (error) {
      console.error(error)
    }
  });
  /* this is the worker / processor above. This carries out the job*/

  const obj = {
    subject: "Your weekly mentioncrawler newsletter",
    heading: "Welcome to Okaydexter",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image:
      "https://images.unsplash.com/photo-1583552188819-4cab7da34a31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
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
  const sendEmail = async (address) => {

    try {
      let config = {
        headers: {
          Authorization: "Bearer ",
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
      console.log('about to send')
      await axios.post("https://api.sendgrid.com/v3/mail/send", data, config)

    } catch (error) {
      console.error('failing here>>>>>>>', error)
    }
  }
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
