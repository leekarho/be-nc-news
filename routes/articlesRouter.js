const articlesRouter = require("express").Router();
const artControllers = require("../controllers/articles.controller");
const commentsControllers = require("../controllers/comments.controller");

articlesRouter
  .route("/articles")
  .get(artControllers.getAllArticles)
  .post(artControllers.postArticle);

articlesRouter
  .route("/articles/:article_id")
  .get(artControllers.getArticleById)
  .patch(artControllers.patchArticleById);

articlesRouter
  .route("/articles/:article_id/comments")
  .get(commentsControllers.getCommentsByArticleId)
  .post(commentsControllers.postCommentOnArticleId);

module.exports = articlesRouter;
