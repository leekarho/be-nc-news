const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count 
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`,
      [article_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return data.rows[0];
    });
};

exports.selectAllArticles = (topic) => {
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id`;

  const queryArr = [];

  if (topic) {
    queryStr += " WHERE topic = $1";
    queryArr.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(queryStr, queryArr).then((data) => {
    // if (data.rows.length === 0) {
    //   return Promise.reject({ status: 404, msg: "Not found" });
    // }
    return data.rows;
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query("SELECT votes FROM articles WHERE article_id = $1", [article_id])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      const newVotes = data.rows[0].votes + inc_votes;
      return db.query(
        `UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *`,
        [newVotes, article_id]
      );
    })
    .then((data) => {
      return data.rows[0];
    });
};
