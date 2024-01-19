const { selectAllTopics, insertNewTopic } = require("../models/topics.model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewTopic = (req, res, next) => {
  const { description, slug } = req.body;

  insertNewTopic(description, slug)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
