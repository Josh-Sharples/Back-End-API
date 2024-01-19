const commentsRouter = require('express').Router();
const { deleteComment } = require('../db/Controllers/controller');

commentsRouter.delete('/:comment_id', deleteComment);



module.exports = commentsRouter;