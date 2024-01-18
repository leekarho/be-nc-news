const express = require("express");
const apiRouter = require("./routes/apiRouter");
const articlesRouter = require("./routes/articlesRouter");
const commentsRouter = require("./routes/commentsRouter");
const usersRouter = require("./routes/usersRouter");
const topicsRouter = require("./routes/topicsRouter");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/api", usersRouter);

app.use("/api", topicsRouter);

app.use("/api", articlesRouter);

app.use("/api", commentsRouter);

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
