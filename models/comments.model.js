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

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query("DELETE from comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      console.log(data.rows);
      return data.rows;
    });
};
