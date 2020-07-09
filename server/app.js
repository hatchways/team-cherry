const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
// const pingRouter = require("./routes/ping");
const authRoutes = require("./routes/users");
// const testMiddleware = require("./routes/testMiddleware");
const Queue = require('bull');
const nodemailer = require('nodemailer');
const { User, Mention, Company } = require("./models");
const callScraper = require("./scraper");



const { json, urlencoded } = express;


var app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/ping", pingRouter);
app.use("/api/users", authRoutes);
// app.use("/test", testMiddleware);



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

//async tasks


// const weeklyEmailQueue = new Queue('sendMail', { //Make sure redis is set on your end. default port should be 6379
//   //this creates a queue in redis called sendmail, the value of sendmail is the configuration of the queue
//   redis: {
//     host: '127.0.0.1',
//     port: 6379,
//   }
// });

const weeklyMentionScraper = new Queue('scrapeCompanies', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
})

const getCompanies = async () => {
  try {
    const companies = await Company.findAll()
    return companies
  } catch (error) {
    console.error(error)
  }
}

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

weeklyMentionScraper.add([], { repeat: { cron: ' */20 * * * * *' } })

// weeklyEmailQueue.add([], { repeat: { cron: ' */10 * * * * *' } });
/*This is a job. Parameters are items for worker func to process the job, and the configuration for when job should be repeated. Right now it is set up to repeat every minute */

weeklyMentionScraper.process(async () => {
  try {
    const companies = await getCompanies()
    for (let company of companies) {
      let mentions = await callScraper(company.name)

      for (let m of mentions) {
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

        await company.addMention(mention);
      }
      console.log(`[Scraper] Finished adding mentions for ${company.name}`);
    }
  } catch (error) {
    console.error(error)
  }
})

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
