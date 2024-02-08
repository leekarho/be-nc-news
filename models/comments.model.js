const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id, limit = 10, p = 1) => {
  if (isNaN(limit)) return Promise.reject({ status: 400, msg: "Bad request" });

  if (isNaN(p)) return Promise.reject({ status: 400, msg: "Bad request" });

  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET (${limit} * ${p})-${limit} `,
      [article_id]
    )
    .then((data) => {
      return data.rows;
    });
};

exports.insertCommentOnArticleId = (article_id, body, username) => {
  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *",
      [article_id, body, username]
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
      return data.rows;
    });
};

exports.updateCommentByCommentId = (comment_id, vote) => {
  return db
    .query(
      `UPDATE comments 
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *`,
      [comment_id, vote]
    )
    .then((data) => {
      return data.rows[0];
    });
};
