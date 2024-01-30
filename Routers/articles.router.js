const articlesRouter = require('express').Router();
const { 
  getArticleById, 
  getAllArticles, 
  getCommentsForArticleId, 
  postCommentForArticleId,
  patchArticleById,
  postArticle
 } = require('../db/Controllers/controller')


articlesRouter.get('/', getAllArticles);

articlesRouter.get('/:article_id', getArticleById);

articlesRouter.get('/:article_id/comments', getCommentsForArticleId);

articlesRouter.post('/:article_id/comments', postCommentForArticleId);

articlesRouter.patch('/:article_id', patchArticleById);

articlesRouter.post('/', postArticle);

module.exports = articlesRouter;