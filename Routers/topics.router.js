const topicsRouter = require('express').Router();
const { getTopics } = require('../db/Controllers/controller')

topicsRouter.get('/', getTopics);



module.exports = topicsRouter;