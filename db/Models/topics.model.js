const db = require('../connection')

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics;').then((result) => {
    return result.rows
  });
};

exports.selectArticleById = (article_id) => {
  return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
  `, [article_id]).then(({rows}) => {
    if (rows.length === 0) {
     return Promise.reject({status: 404, msg : 'Article ID not found'})
    }
    return rows[0]
  })
}

exports.selectAllArticles = () => {
  return db.query(`
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`)
    .then(({ rows }) => {
      rows.forEach(article => {
        delete article.body;
      });
      return rows;
    });
}

exports.selectCommentsFromArticleId = (article_id) => {
  return db.query(`
    SELECT * FROM comments 
    WHERE comments.article_id = $1
    ORDER BY created_at DESC;
    `, [article_id])
    .then(({rows}) => {
      return rows
    })
}

exports.insertCommentForArticleId = (username, body, article_id) => {
  return db.query(`
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [username, body, article_id])
  .then(({rows}) => {
    return rows[0]
  })
}

exports.updateArticleVotes = (updatedVotes) => {
  const {inc_votes} = updatedVotes
  const {article_id} = updatedVotes
  return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE
    article_id = $2
    RETURNING *
  `, [inc_votes, article_id])
  .then(({rows}) => {
    if (rows[0].votes <= 0) {
      rows[0].votes = 0
    }
    return rows[0]
  })
}