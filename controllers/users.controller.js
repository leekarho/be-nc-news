const { selectAllUsers } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  console.log("getAllUsers");
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
