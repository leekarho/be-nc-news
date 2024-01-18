const db = require("../db/connection");

exports.selectAllUsers = () => {
  return db.query("SELECT * FROM users").then((data) => {
    return data.rows;
  });
};

exports.selectUserById = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((data) => {
      return data.rows[0];
    });
};
