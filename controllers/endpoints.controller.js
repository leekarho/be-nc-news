const endPoints = require("../endpoints.json");

exports.getAllEndpoints = (req, res) => {
  res.status(200).send(endPoints);
};
