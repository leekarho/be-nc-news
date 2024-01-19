const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller");

usersRouter.route("/").get(usersController.getAllUsers);

usersRouter.route("/:username").get(usersController.getUserById);

module.exports = usersRouter;
