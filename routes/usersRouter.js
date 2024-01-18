const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");

usersRouter.route("/users").get(usersController.getAllUsers);

usersRouter.route("/users/:username").get(usersController.getUserById);

module.exports = usersRouter;
