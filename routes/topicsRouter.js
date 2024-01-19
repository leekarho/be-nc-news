const topicsRouter = require("express").Router();
const topicsController = require("../controllers/topics.controller");

topicsRouter.route("/").get(topicsController.getAllTopics);

module.exports = topicsRouter;
