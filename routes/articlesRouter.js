const articlesRouter = require("express").Router();
const artControllers = require("../controllers/articles.controller");
const commentsControllers = require("../controllers/comments.controller");

articlesRouter.get("/articles", artControllers.getAllArticles);

articlesRouter
  .route("/articles/:article_id")
  .get(artControllers.getArticleById)
  .patch(artControllers.patchArticleById);

articlesRouter
  .route("/articles/:article_id/comments")
  .get(commentsControllers.getCommentsByArticleId)
  .post(commentsControllers.postCommentOnArticleId);

module.exports = articlesRouter;
