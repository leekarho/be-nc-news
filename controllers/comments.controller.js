const { selectCommentsByArticleId } = require("../models/comments.model");
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
