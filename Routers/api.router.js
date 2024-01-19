const apiRouter = require('express').Router();

const userRouter = require('./users.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const topicsRouter = require('./topics.router');

const { getAllEndpoints } = require('../db/Controllers/controller')


apiRouter.get('/', getAllEndpoints);

apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
