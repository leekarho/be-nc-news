const db = require("../db/connection");

exports.selectArticleById = (id) => {
  const articleId = id.article_id;
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return data.rows[0];
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
   `
    )
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    });
};
