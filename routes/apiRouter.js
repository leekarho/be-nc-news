const apiRouter = require("express").Router();
const endPoint = require("../controllers/endpoints.controller");

apiRouter.get("/", endPoint.getAllEndpoints);

module.exports = apiRouter;
