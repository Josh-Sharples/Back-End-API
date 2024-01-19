const { 
  selectTopics, 
  selectArticleById, 
  selectAllArticles,
  selectCommentsFromArticleId,
  insertCommentForArticleId,
  updateArticleVotes,
  deleteCommentById,
  selectAllUsers,
  selectUserByUsername,
  updateCommentById
  } = require('../Models/model')
const allEndpoints = require('../../endpoints.json')

exports.getTopics = (req, res, next) => {
  selectTopics().then((topic) => {
    res.status(200).send({topic})
  })
};

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).send(allEndpoints)
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params

  selectArticleById(article_id).then((article) => {
    res.status(200).send({article})
  }).catch((err) => {
    next(err)
  })
}

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  
  selectAllArticles(sort_by, order, topic).then((articles) => {
    res.status(200).send(articles)
  }).catch((err) => {
    next(err)
  })
}

exports.getCommentsForArticleId = (req, res, next) => {
  const { article_id } = req.params

  selectCommentsFromArticleId(article_id).then((comments) => {
    res.status(200).send(comments)
  }).catch((err) => {
    next(err)
  })
}

exports.postCommentForArticleId = (req, res, next) => {
  const { username, body } = req.body
  const article_id = req.params.article_id

  insertCommentForArticleId(username, body, article_id)
  .then((comment) => {
    res.status(201).send({ comment })
  })
  .catch((err) => {
    next(err)
  })
}

exports.patchArticleById = (req, res, next) => {
  const newArticleVotes = req.body;
  const { article_id } = req.params;
  newArticleVotes.article_id = +article_id

  updateArticleVotes(newArticleVotes).then((updatedVote) => {
    res.status(200).send({ updatedVote })
  })
  .catch((err) => {
    next(err)
  })
}

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params

  deleteCommentById(comment_id).then((deletedComment) => {
    res.status(204).send()
  })
  .catch((err) => {
    next(err)
  })
}

exports.getAllUsers = (req, res, next) => {
  selectAllUsers().then((users) => {
    res.status(200).send(users)
  })
  .catch((err) => {
    next(err)
  })
}

exports.getUserByUsername = (req, res, next) => {
const { username } = req.params

selectUserByUsername(username).then((user) => {
  res.status(200).send(user)
})
.catch((err) => {
  next(err);
})
}

exports.patchCommentById = (req, res, next) => {
const { comment_id } = req.params;
const newCommentVotes = req.body;
newCommentVotes.comment_id = +comment_id

updateCommentById(newCommentVotes).then((updatedVote) => {
  res.status(200).send(updatedVote)
})
.catch((err) => {
  next(err)
})
}
