const express = require('express');
const app = express();
const { getTopics, getAllEndpoints, getArticleById, getAllArticles } = require('./Controllers/topics.controller')

app.get('/api/topics', getTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles);

app.all('*', (req, res) => {
  res.status(404).send({status: 404, msg : 'Endpoint not found'})
})

app.use((err, req, res, next) => {
  if (err.status === 400 || err.code === '22P02') {
    res.status(400).send({status: 400, msg : 'Bad request'});
  } else {
    next(err);
  }
})

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({status: 404, msg: 'Article ID not found'})
  } else {
    next(err);
  }
})


module.exports = app;

