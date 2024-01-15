const express = require('express');
const app = express();
const { getTopics } = require('./Controllers/topics.controller')

app.use(express.json())

app.get('/api/topics', getTopics)

app.all('*', (req, res) => {
  res.status(404).send({msg : 'Endpoint not found'})
})


module.exports = app;