const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics").then((data) => {
    console.log(data.rows);
    return data.rows;
  });
};
