const {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
} = require("../models/articles.model");
const { checkTopicExists } = require("../utils");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  const topicCheck = checkTopicExists(topic);
  const selectQuery = selectAllArticles(topic, sort_by, order);

  Promise.all([selectQuery, topicCheck])
    .then((response) => {
      const articles = response[0];
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
