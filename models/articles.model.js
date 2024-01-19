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

exports.selectAllArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1
) => {
  const acceptedSortBy = [
    "title",
    "topic",
    "author",
    "created_at",
    "article_img_url",
  ];
  const acceptedOrder = ["asc", "desc"];

  if (!acceptedSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (isNaN(limit)) return Promise.reject({ status: 400, msg: "Bad request" });

  if (isNaN(p)) return Promise.reject({ status: 400, msg: "Bad request" });

  if (limit > 10) {
    limit = 10;
  }

  const firstQueryArr = [];

  let firstQueryStr = "SELECT CAST(COUNT(*) AS INT) FROM articles";

  const queryArr = [];

  if (topic) {
    firstQueryStr += " WHERE topic = $1";
    firstQueryArr.push(topic);
  }

  return db
    .query(firstQueryStr, firstQueryArr)
    .then((data) => {
      return data.rows[0].count;
    })
    .then((numRecords) => {
      const maxP = Math.ceil(numRecords / limit);
      if (p > maxP && maxP !== 0) {
        p = maxP;
      }

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
      ORDER BY ${sort_by} ${order}
      LIMIT ${limit} OFFSET (${limit} * ${p})-${limit}`;

      return db.query(queryStr, queryArr).then((data) => {
        const total_count = numRecords;
        return [data.rows, total_count];
      });
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

exports.insertArticles = (
  title,
  topic,
  author,
  body,
  article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
) => {
  return db
    .query(
      `INSERT INTO articles (
    author, title, body, topic, article_img_url 
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`,
      [author, title, body, topic, article_img_url]
    )
    .then((data) => {
      return data.rows[0];
    })
    .then((data) => {
      const { article_id } = data;
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
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(
      `DELETE FROM comments 
  WHERE article_id = $1`,
      [article_id]
    )
    .then(() => {
      return db.query(
        `DELETE FROM articles 
    WHERE article_id = $1
    RETURNING *`,
        [article_id]
      );
      // .then((data) => {
      //   if (data.rows.length === 0) {
      //     return Promise.reject({ status: 404, msg: "Not found" });
      //   }
      // });
    });
};
