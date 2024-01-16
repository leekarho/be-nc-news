const db = require("../db/connection");

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [id]
    )
    .then((data) => {
      return data.rows;
    });
};

exports.insertCommentOnArticleId = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *",
      [article_id, username, body]
    )
    .then((data) => {
      return data.rows[0];
    });
};
