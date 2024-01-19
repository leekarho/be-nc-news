const {
  selectArticleById,
  selectAllArticles,
  updateArticleById,
  insertArticles,
  removeArticleById,
} = require("../models/articles.model");
const { checkTopicExists, checkArticleExists } = require("../utils");

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
  const { topic, sort_by, order, limit, p } = req.query;

  const topicCheck = checkTopicExists(topic);
  const selectQuery = selectAllArticles(topic, sort_by, order, limit, p);

  Promise.all([selectQuery, topicCheck])
    .then((response) => {
      const articles = response[0][0];
      const total_count = response[0][1];
      res.status(200).send({ articles, total_count });
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

exports.postArticle = (req, res, next) => {
  const { title, topic, author, body, article_img_url } = req.body;
  insertArticles(title, topic, author, body, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  const articleCheck = checkArticleExists(article_id);
  const selectQuery = removeArticleById(article_id);

  Promise.all([articleCheck, selectQuery])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
