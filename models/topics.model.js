const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics").then((data) => {
    return data.rows;
  });
};

exports.insertNewTopic = (description, slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then((data) => {
      if (data.rows.length > 0)
        return Promise.reject({ status: 400, msg: "Bad request" });

      return db
        .query(
          `INSERT INTO topics (description, slug)
            VALUES ($1, $2)
            RETURNING *`,
          [description, slug]
        )
        .then((data) => {
          return data.rows[0];
        });
    });
};
