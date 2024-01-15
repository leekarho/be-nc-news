const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { getAllEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controller");
const app = express();

app.use(express.json());

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.use((err, req, res, next) => {
  if (err.msg === "Not found") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
