const express = require('express');
const app = express();
const { getTopics, getAllEndpoints, getArticleById } = require('./Controllers/topics.controller')

app.get('/api/topics', getTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticleById)

app.all('*', (req, res) => {
  res.status(404).send({msg : 'Endpoint not found'})
})

app.use((err, req, res, next) => {
  if (err.status === 400 || err.code === '22003') {
    res.status(400).send({status: 400, msg : 'Bad request'});
  } else {
    next(err);
  }
})


module.exports = app;