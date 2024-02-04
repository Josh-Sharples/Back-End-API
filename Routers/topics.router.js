const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../db/Controllers/controller')

topicsRouter.get('/', getTopics);

topicsRouter.post('/', postTopic);

module.exports = topicsRouter;