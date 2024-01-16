const {
  selectCommentsByArticleId,
  insertCommentOnArticleId,
} = require("../models/comments.model");
const { checkArticleExists } = require("../utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const articleCheck = checkArticleExists(article_id);
  const selectQuery = selectCommentsByArticleId(article_id);

  Promise.all([selectQuery, articleCheck])
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentOnArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentOnArticleId(article_id, body, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
