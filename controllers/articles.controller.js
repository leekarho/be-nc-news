const {
  selectArticleById,
  selectAllArticles,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const id = req.params;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
