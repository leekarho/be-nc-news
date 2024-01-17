const {
  selectCommentsByArticleId,
  insertCommentOnArticleId,
  removeCommentByCommentId,
} = require("../models/comments.model");
const { checkArticleExists, checkUsernameExists } = require("../utils");

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

  const articleCheck = checkArticleExists(article_id);
  const usernameCheck = checkUsernameExists(username);
  const selectQuery = insertCommentOnArticleId(article_id, body, username);

  Promise.all([selectQuery, articleCheck, usernameCheck])
    .then((response) => {
      const comment = response[0];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
