const { 
  selectTopics, 
  selectArticleById, 
  selectAllArticles,
  selectCommentsFromArticleId,
  } = require('../Models/topics.model')
const allEndpoints = require('../../endpoints.json')

exports.getTopics = (req, res, next) => {
  selectTopics().then((topic) => {
    res.status(200).send({topic})
  })
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

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send(articles)
  })
}

exports.getCommentsForArticleId = (req, res, next) => {
  const { article_id } = req.params
  
  selectCommentsFromArticleId(article_id).then((comments) => {
    res.status(200).send(comments)
  })
}