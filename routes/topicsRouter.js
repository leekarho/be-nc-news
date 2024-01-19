const topicsRouter = require("express").Router();
const topicsController = require("../controllers/topics.controller");

topicsRouter
  .route("/")
  .get(topicsController.getAllTopics)
  .post(topicsController.postNewTopic);

module.exports = topicsRouter;
