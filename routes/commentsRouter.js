const commentsRouter = require("express").Router();
const commentsControllers = require("../controllers/comments.controller");

commentsRouter
  .route("/comments/:comment_id")
  .patch(commentsControllers.patchCommentByCommentId)
  .delete(commentsControllers.deleteCommentByCommentId);

module.exports = commentsRouter;
