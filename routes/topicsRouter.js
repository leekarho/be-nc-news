const topicsRouter = require("express").Router();
const topicsController = require("../controllers/topics.controller");

topicsRouter.route("/topics").get(topicsController.getAllTopics);

module.exports = topicsRouter;
