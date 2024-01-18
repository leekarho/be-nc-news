const { selectAllUsers, selectUserById } = require("../models/users.model");
const { checkUsernameExists } = require("../utils");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  const usernameCheck = checkUsernameExists(username);
  const selectQuery = selectUserById(username);

  Promise.all([selectQuery, usernameCheck])
    .then((response) => {
      const user = response[0];
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
