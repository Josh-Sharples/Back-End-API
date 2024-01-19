const express = require('express');
const apiRouter = require('../Routers/api.router')
const app = express();
const { 
  getTopics, 
  getAllEndpoints, 
  getArticleById, 
  getAllArticles, 
  getCommentsForArticleId,
  postCommentForArticleId,
  patchArticleById,
  deleteComment,
  getAllUsers,
} = require('./Controllers/controller')

app.use(express.json())

//------------------Requests------------------------

app.use('/api', apiRouter)


//----------------Error Handling------------------------
app.all('*', (req, res) => {
  res.status(404).send({status: 404, msg : 'Endpoint not found'})
})

app.use((err, req, res, next) => {
  if (err.status === 400 || err.code === '22P02' || err.code === '23502') {
    res.status(400).send({status: 400, msg : 'Bad request'});
  } else {
    next(err);
  }
})

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err)
  }
  if (err.code === '23503') {
    res.status(404).send({status: 404, msg: 'ID not found'})
  } else {
    next(err);
  }
})

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error'})
});


module.exports = app;

