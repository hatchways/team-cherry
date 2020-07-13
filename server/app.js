const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const authRoutes = require("./routes/users");
const mentionsRoutes = require("./routes/mentions");
const companyRoutes = require("./routes/company");
const callScraper = require("./scraper");
const { json, urlencoded } = express;
const Queue = require('bull');
const nodemailer = require('nodemailer');
const { Mention, Company, User } = require("./models");

// const asyncWorker = require('../async-worker')

var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/api/users", authRoutes);
app.use("/api/mentions", mentionsRoutes);
app.use("/api/company", companyRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

/* Task Queues*/


//Declaring both queues in redis. WeeklyMentions adds companies as jobs for companyscraper. Companyscraper does the scraping and adds to db + gets list of users for that company.
const weeklyMentions = new Queue('companies', {
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

weeklyMentions.add([], { repeat: { cron: ' */10 * * * * *' } })
//adds a job to be done for each company every so often (set at 10 seconds)

weeklyMentions.process(async () => {
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
      },
    });
    await company.addMention(mention)
  }
  //and gets users associated with company
  const users = await User.findAll({
    include: [{
      model: Company,
      where: { id: job.data.id }
    }],
  })
})

weeklyMentions.on('completed', (job, result) => {
  console.log('companies successfully scraped')
  // console.log('database updated with new mentions')
})


//Task queue for emailing

// const weeklyEmailQueue = new Queue('sendMail', { //Make sure redis is set on your end. default port should be 6379
//   //this creates a queue in redis called sendmail, the value of sendmail is the configuration of the queue
//   redis: {
//     host: '127.0.0.1',
//     port: 6379,
//   }
// });


// const getEmails = async () => {
//   try {
//     const emails = await User.findAll({
//       attributes: ['email']
//     })
//     return emails
//   } catch (error) {
//     console.error(error)
//   }
// }

// weeklyEmailQueue.add([], { repeat: { cron: ' */10 * * * * *' } });
/*This is a job. Parameters are items for worker func to process the job, and the configuration for when job should be repeated. Right now it is set up to repeat every minute */

// weeklyMentionScraper.process(async () => {
//   try {
//     console.log("[Scraper] Calling async scraper in queue");
//     const companies = await Company.findAll()
//     console.log('in task queue', companies)
//     for (let company of companies) {
//       let mentions = await callScraper(company.name)

//       for (let m of mentions) {
//         [mention, isNew] = await Mention.findOrCreate({
//           where: {
//             id: m.id,
//           },
//           defaults: {
//             id: m.id,
//             title: m.title,
//             platform: m.platform,
//             date: m.date,
//             content: m.content,
//             popularity: m.popularity,
//             imageUrl: m.image,
//           },
//         });

//         await company.addMention(mention);
//       }
//       return
//       console.log(`[Scraper] Finished adding mentions for ${company.name}`);
//     }
//   } catch (error) {
//     console.error(error)
//   }
// })

// weeklyMentionScraper.on('completed', (job, result) => {
//   console.log('this is the result', result)
//   console.log('database updated with new mentions')
// })

// weeklyEmailQueue.process(async () => {
//   try {
//     const data = await getEmails()
//     const emails = []
//     data.forEach((current) => {
//       emails.push(current.dataValues.email)
//     })
//     emails.forEach((email) => {
//       sendMail(email);
//     })
//   } catch (error) {
//     console.error(error)
//   }

// });
/* this is the worker / processor above. This carries out the job*/


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
//       pass: 'P455w0rd'
//     }
//   };
//   nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.log(err)
//       reject(err);
//     } else {
//       console.log('success')
//       resolve(info);
//     }
//   });
// }


module.exports = app;


