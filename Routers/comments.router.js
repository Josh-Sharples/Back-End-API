const commentsRouter = require('express').Router();
const { deleteComment, patchCommentById } = require('../db/Controllers/controller');

commentsRouter.delete('/:comment_id', deleteComment);

commentsRouter.patch('/:comment_id', patchCommentById)



module.exports = commentsRouter;