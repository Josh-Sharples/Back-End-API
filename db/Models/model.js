const db = require('../connection')

exports.selectTopics = () => {
  return db.query('SELECT * FROM topics;').then((result) => {
    return result.rows
  });
};

exports.selectArticleById = (article_id) => {
  return db.query(`
  SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
`, [article_id]).then(({rows}) => {
    if (rows.length === 0) {
     return Promise.reject({status: 404, msg : 'ID not found'})
    }
    return rows[0]
  })
}

exports.selectAllArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
 
  const validSortQueries = ['created_at', 'article_id', 'author', 'votes']
  if(!validSortQueries.includes(sort_by)) {
    return Promise.reject({status: 404, msg : 'Sort_by query not found'})
  }

  const validSortInOrderQueries = ['ASC', 'DESC']
  if (!validSortInOrderQueries.includes(order)) {
    return Promise.reject({ status: 404, msg: 'Order query not found' }); 
  }

  const validTopics = ['Mitch', 'cats', 'paper', '']
  if(topic && !validTopics.includes(topic)) {
    return Promise.reject({status: 404, msg : 'Topic not found'});
  }

  let queryString = `
    SELECT articles.article_id, articles.title, articles.topic, 
    articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `

  const queryParam = [];
  if (topic) {
    queryString += ` WHERE articles.topic = $1`
    queryParam.push(topic)
  }
  
  queryString += ' GROUP BY articles.article_id'

  queryString += ` ORDER BY ${sort_by} ${order};`

  return db.query(queryString, queryParam)
    .then(({rows}) => {
     return rows
    })
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
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg : 'ID not found'})
    }
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
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg : 'ID not found'})
    }
    if (rows[0].votes <= 0) {
      rows[0].votes = 0
    }
    return rows[0]
  })
}

exports.deleteCommentById = (comment_id) => {
  return db.query(`
    DELETE FROM comments
    WHERE
    comment_id = $1
    RETURNING *
  `, [comment_id]
  )
  .then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg : 'ID not found'})
     }
     return rows[0]
  })
}

exports.selectAllUsers = () => {
  return db.query(`
    SELECT * FROM users;
  `)
  .then(({rows}) => {
    return rows
  })
}

exports.selectUserByUsername = (username) => {

  const validUsernames = ['butter_bridge', 'icellusedkars', 'rogersop', 'lurker']
  if (!validUsernames.includes(username)) {
    return Promise.reject({status: 404, msg : 'Username not found'})
  }

  let queryString = `
    SELECT * FROM users
    WHERE users.username = $1;
  `

  return db.query(queryString, [username])
  .then(({rows}) => {
    return rows[0]
  })
}

exports.updateCommentById = (updatedVotes) => {
  const {inc_votes} = updatedVotes
  const {comment_id} = updatedVotes
 
  return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE
    comment_id = $2
    RETURNING *
  `, [inc_votes, comment_id])
  .then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg : 'ID not found'})
    }
    if (rows[0].votes <= 0) {
      rows[0].votes = 0
    }
    return rows[0]
  })
}