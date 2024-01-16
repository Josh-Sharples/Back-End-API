const { selectTopics, selectArticleById } = require('../Models/topics.model')
const allEndpoints = require('../../endpoints.json')

exports.getTopics = (req, res, next) => {
  selectTopics().then((topic) => {
    res.status(200).send({topic})
  });
};

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).send(allEndpoints)
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  selectArticleById(article_id).then((article) => {
    res.status(200).send({article})
  }).catch((err) => {
    next(err)
  })
}