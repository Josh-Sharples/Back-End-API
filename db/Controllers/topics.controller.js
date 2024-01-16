const { selectTopics } = require('../Models/topics.model')
const allEndpoints = require('../../endpoints.json')

exports.getTopics = (req, res, next) => {
  selectTopics().then((topic) => {
    res.status(200).send({topic})
  });
};

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).send(allEndpoints)
};