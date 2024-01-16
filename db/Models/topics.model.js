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
  return db.query('SELECT * FROM articles ORDER BY created_at DESC')
    .then(({ rows: articles }) => {
      const promises = articles.map(article => {
        return db.query('SELECT COUNT(*) FROM comments WHERE article_id = $1', [article.article_id])
          .then(({ rows: [{ count }] }) => {
            article.comment_count = count
            delete article.body
            return article
          })
      })
      return Promise.all(promises);
    })
};
