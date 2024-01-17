const db = require("./db/connection");

exports.checkArticleExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.checkUsernameExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  let queryStr = "SELECT * FROM topics";

  const queryArr = [];

  if (topic) {
    queryStr += " WHERE slug = $1";
    queryArr.push(topic);
  }

  return db.query(queryStr, queryArr).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
  });
};
