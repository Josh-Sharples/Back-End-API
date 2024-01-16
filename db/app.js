const express = require('express');
const app = express();
const { getTopics, getAllEndpoints } = require('./Controllers/topics.controller')

app.get('/api/topics', getTopics);

app.get('/api', getAllEndpoints);

app.all('*', (req, res) => {
  res.status(404).send({msg : 'Endpoint not found'})
})


module.exports = app;