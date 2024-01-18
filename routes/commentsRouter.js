const commentsRouter = require("express").Router();
const commentsControllers = require("../controllers/comments.controller");

commentsRouter
  .route("/comments/:comment_id")
  .delete(commentsControllers.deleteCommentByCommentId);

module.exports = commentsRouter;
