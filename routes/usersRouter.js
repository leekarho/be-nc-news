const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");

usersRouter.route("/users").get(usersController.getAllUsers);

module.exports = usersRouter;
