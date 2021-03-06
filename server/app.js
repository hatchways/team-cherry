const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const authRoutes = require("./routes/users");
const mentionsRoutes = require("./routes/mentions");
const companyRoutes = require("./routes/company");
const { json, urlencoded } = express;
const { UI } = require('bull-board')


var app = express();

app.use('/admin/queues', UI)
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


module.exports = app;


