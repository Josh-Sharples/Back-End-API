const request = require('supertest');
const app = require('../db/app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const allEndpoints = require('../endpoints.json');


afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('App.js', () => {
  describe('App Endpoints', () => {
    test('api/topics - responds with all topics and 200 status code', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body.topic.length).toBe(3);
          res.body.topic.forEach((topic) => {
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string')
          })
        })
    })
    test('get /api - responds with 200 and all possible api endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(allEndpoints)
        })
    })
    test('api/articles/:article_id', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          })
        })
    })
    test('api/articles - responds with status code 200 & has all relevent properties', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].comment_count).toEqual('2')
          expect(res.body.articles.length).toBe(10);
          res.body.articles.forEach((article) => {
            expect(article.hasOwnProperty('article_id')).toEqual(true);
            expect(article.hasOwnProperty('title')).toEqual(true);
            expect(article.hasOwnProperty('topic')).toEqual(true);
            expect(article.hasOwnProperty('author')).toEqual(true);
            expect(article.hasOwnProperty('created_at')).toEqual(true);
            expect(article.hasOwnProperty('votes')).toEqual(true);
            expect(article.hasOwnProperty('article_img_url')).toEqual(true);
            expect(article.hasOwnProperty('comment_count')).toEqual(true);
            expect(article.hasOwnProperty('body')).toEqual(false);
          })
          })
    })
    test('api/articles - responds with status code 200 & has all relevent properties in descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
         expect(res.body.articles).toBeSortedBy('created_at', {descending: true})
          })
      })
      test('api/articles/:article_id/comments - responds with status code 200 & all comments for relevant article_id with most recent comments first', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({body}) => {
            expect(body.length).toBe(10);
            expect(body[0]).toEqual({
              comment_id: 5,
              body: 'I hate streaming noses',
              article_id: 1,
              author: 'icellusedkars',
              votes: 0,
              created_at: '2020-11-03T21:00:00.000Z',
            })
            expect(body).toBeSortedBy('created_at', {descending: true});
          })
        })
        test('api/articles/:article_id/comments - responds with 200 & returns empty array for correct id but has no comments', () => {
          return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({body}) => {
            expect(body).toEqual([])
          }) 
        })
        test('POST - api/articles/:article_id/comments - responds with 201 and comment object has been posted to comments array under the correct article_id', () => {
          const commentToAdd = {
            username: 'butter_bridge',
            body: "I haven't posted in a while!"
          };
          return request(app)
          .post('/api/articles/3/comments')
          .send(commentToAdd)
          .expect(201)
          .then((res) => {
           expect(res.body.comment).toMatchObject({
              comment_id: 19,
              body: "I haven't posted in a while!",
              article_id: 3,
              author: 'butter_bridge'
           })
          })
        })
        test('POST - api/articles/:article_id/comments - checks that extra inputs are ignored', () => {
          const commentToAdd = {
            username: 'butter_bridge',
            body: "I haven't posted in a while!",
            extraProperty: 'extraProperty'
          };
          return request(app)
          .post('/api/articles/3/comments')
          .send(commentToAdd)
          .expect(201)
          .then((res) => {
           expect(res.body.comment.hasOwnProperty('extraProperty')).toBe(false)
           })
        })
        test('PATCH - api/articles/:article_id - responds with 200 & updated votes property', () => {
          return request(app)
          .patch('/api/articles/1')
          .send({
            inc_votes: 15
          })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedVote).toMatchObject({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              votes: 115,
            })
          })
        })
        test('PATCH - api/articles/:article_id - responds with 200 & updated votes property for minus votes', () => {
          return request(app)
          .patch('/api/articles/1')
          .send({
            inc_votes: -15
          })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedVote).toMatchObject({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              votes: 85,
            })
          })
        })
        test('PATCH - api/articles/:article_id - responds with 200 & checks that votes will not go into negative figures', () => {
          return request(app)
          .patch('/api/articles/4')
          .send({
            inc_votes: -15
          })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedVote).toMatchObject({
              article_id: 4,
              title: 'Student SUES Mitch!',
              topic: 'mitch',
              author: 'rogersop',
              body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
              votes: 0,
            })
          })
        })
        test('PATCH - api/articles/:article_id - check it ignores other properties', () => {
          return request(app)
          .patch('/api/articles/1')
          .send({
            inc_votes: -15,
            extraProperty: 'extraProperty'
          })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedVote.hasOwnProperty('extraProperty')).toBe(false)
            expect(res.body.updatedVote).toMatchObject({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              votes: 85,
            })
          })
        })
        test('DELETE - /api/comments/:comment_id - responds with 204 - deletes comment using comment_id', () => {
          return request(app)
          .delete('/api/comments/1')
          .expect(204)
        })
        test('GET - /api/users - responds with 200 & users array', () => {
          return request(app)
          .get('/api/users')
          .expect(200)
          .then((res) => {
            expect(res.body.length).toEqual(4)
            res.body.forEach((user) => {
              expect(typeof user.username).toBe('string')
              expect(typeof user.name).toBe('string')
              expect(typeof user.avatar_url).toBe('string')
            })
          })
        })
        test('GET - /api/articles?:topic - should return status code 200 and a list of all filtered articles by specified topic and still remains in descending order by created_at', () => {
          return request(app)
          .get('/api/articles?topic=football')
          .expect(200)
          .then((res) => {
            console.log(res.body.articles)
          expect(res.body.articles.length).toEqual(0)
          res.body.articles.forEach((article) => {
            expect(article.topic).toBe('football')
            expect(res.body.articles).toBeSortedBy('created_at', {descending: true})
          })
          })
        })
        test('GET - /api/articles?topic - should return status 200 when topic is left blank - default to no topic', () => {
          return request(app)
          .get('/api/articles?topic=')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy('created_at', {descending: true})
            res.body.articles.forEach((article) => {
              expect(article.hasOwnProperty('article_id')).toEqual(true);
              expect(article.hasOwnProperty('title')).toEqual(true);
              expect(article.hasOwnProperty('topic')).toEqual(true);
              expect(article.hasOwnProperty('author')).toEqual(true);
              expect(article.hasOwnProperty('created_at')).toEqual(true);
              expect(article.hasOwnProperty('votes')).toEqual(true);
              expect(article.hasOwnProperty('article_img_url')).toEqual(true);
              expect(article.hasOwnProperty('comment_count')).toEqual(true);
              expect(article.hasOwnProperty('body')).toEqual(false);
            })
          })
        })
        test('GET - /api/articles?topic - check if topic is valid but there are no articles associated with it', () => {
          return request(app)
          .get('/api/articles?topic=cooking')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toEqual([])
          })
        })
        test('GET - /api/articles/:article_id - check if comment_count contains the total number of comments for specified article_id', () => {
          return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body.article.hasOwnProperty('comment_count')).toEqual(true);
            expect(res.body.article.comment_count).toEqual('11');
          })
        })
        test('GET - /api/articles/:sort_by - checks if articles are sorted by specified sort_by query - Descending order', () => {
          return request(app)
          .get('/api/articles?sort_by=votes')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toEqual(10)
            expect(res.body.articles).toBeSortedBy('votes', {descending: true})
          })
        })
        test('GET - /api/articles/:sort_by - checks if articles are sorted by specified sort_by query - Ascending order', () => {
          return request(app)
          .get('/api/articles?sort_by=author&order=ASC')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toEqual(10)
            expect(res.body.articles).toBeSortedBy('author')
          })
        })
        test('GET - /api/users/:username - checks it provides relevent user requested via username', () => {
          return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then((res) => {
            expect(typeof res.body.username).toBe('string');
            expect(typeof res.body.name).toBe('string');
            expect(typeof res.body.avatar_url).toBe('string');
          })
        })
        test('PATCH - api/comments/:comment_id - responds with 200 & updated votes property', () => {
          return request(app)
          .patch('/api/comments/2')
          .send({
            inc_votes: 10
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
            comment_id: 2,
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 24,
            author: "butter_bridge",
            article_id: 1,
          })
          })
        })
        test('PATCH - api/comments/:comment_id - responds with 200 & updated votes property (minus votes)', () => {
          return request(app)
          .patch('/api/comments/2')
          .send({
            inc_votes: -5
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
            comment_id: 2,
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 9,
            author: "butter_bridge",
            article_id: 1,
          })
          })
        })
        test('PATCH - api/comments/:comment_id - responds with 200 & checks that votes will not go into negative', () => {
          return request(app)
          .patch('/api/comments/2')
          .send({
            inc_votes: -20
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
            comment_id: 2,
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 0,
            author: "butter_bridge",
            article_id: 1,
          })
          })
        })
        test('PATCH - api/comments/:comment_id - responds with 200 & checks if extra properties are ignored and votes are still updated', () => {
          return request(app)
          .patch('/api/comments/2')
          .send({
            inc_votes: 10,
            extraProperty: 'extraProperty'
          })
          .expect(200)
          .then((res) => {
            expect(res.body.hasOwnProperty('extraProperty')).toBe(false);
            expect(res.body).toMatchObject({
            comment_id: 2,
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 24,
            author: "butter_bridge",
            article_id: 1,
          })
          })
        })
        test('POST - api/articles - responds with 201 and posts a new article', () => {
          const articleToAdd = {
            author: 'butter_bridge',
            title: 'Mitch and his love for SQL',
            body: 'I will marry SQL',
            topic: 'cats',
          };
          return request(app)
          .post('/api/articles')
          .send(articleToAdd)
          .expect(201)
          .then((res) => {
            expect(res.body.article.hasOwnProperty('article_img_url')).toBe(true);
            expect(res.body.article.hasOwnProperty('votes')).toBe(true);
            expect(res.body.article.hasOwnProperty('created_at')).toBe(true);
            expect(res.body.article.hasOwnProperty('comment_count')).toBe(true);
            expect(res.body.article).toMatchObject({
            author: 'butter_bridge',
            title: 'Mitch and his love for SQL',
            body: 'I will marry SQL',
            topic: 'cats',
           })
          })
        })
        test('PAGINATION - /api/articles - should return 10 articles by default', () => {
            return request(app)
            .get('/api/articles?limit=10&p=1')
            .expect(200)
            .then((res) => {
              expect(res.body.articles.length).toEqual(10);
              expect(res.body.hasOwnProperty('total_count')).toBe(true);
            })
        }),
        test('PAGINATION - /api/articles/:article_id/comments - should return 10 comments by default for specified article', () => {
          return request(app)
          .get('/api/articles/1/comments?limit=10&p=1')
          .expect(200)
          .then((res) => {
            expect(res.body.length).toEqual(10);
          })
        })
        test('POST - /api/topics - posts a topic to topics list', () => {
          const topicToAdd = {
            slug: 'topic name',
            description: 'description'
          }
          return request(app)
          .post('/api/topics')
          .send(topicToAdd)
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              slug: 'topic name',
              description: 'description'
            })
          })
        })
        test('DELETE - /api/articles/:article_id - responds with 204 - deletes article using article_id', () => {
          return request(app)
          .delete('/api/articles/1')
          .expect(204)
        })
    })
  })


  //----------------Error Handling------------------------
  describe('Error Handling', () => {
    test('GET - /api/noTable - API error testing for incorrect file path', () => {
      return request(app)
        .get('/api/noTable')
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({status: 404, msg : 'Endpoint not found'});
        }) 
    })
    test('GET - /api/articles/9999 - providing an invalid id - responds with a 404 and error message', () => {
      return request(app)
      .get('/api/articles/9999')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, msg: 'ID not found'});
      })
    })
    test('GET - /api/articles/hello - providing an invalid id - responds with a 400 when testing with a different data type', () => {
      return request(app)
      .get('/api/articles/hello')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
    test('GET - /api/articles/comments - not providing an id - responds with a 400', () => {
      return request(app)
      .get('/api/articles/comments')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({status: 400, msg : 'Bad request'});
      })
    })
    test('providing a valid id but id not found - responds with a 404', () => {
      const commentToAdd = {
        username: 'butter_bridge',
        body: "I haven't posted in a while!"
      };
      return request(app)
      .post('/api/articles/999/comments')
      .send(commentToAdd)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg: 'ID not found'});
      })
    })
    test('GET - /api/articles/:comment_id/comments - approviding an object to post with missing values', () => {
      const commentToAdd = {
        body: "I haven't posted in a while!"
      };
      return request(app)
      .post('/api/articles/3/comments')
      .send(commentToAdd)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({status: 400, msg : 'Bad request'});
      })
    })
    test('PATCH - /api/articles/:article_id - responds with 400 when proprty value is of another data type', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: 'hello'
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
    test('PATCH - /api/articles/:article_id - responds with 400 when article_id is an invalid data type', () => {
      return request(app)
      .patch('/api/articles/hello')
      .send({
        inc_votes: 15
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
    test('PATCH - /api/articles/:article_id - responds with 404 when article_id is valid but not found', () => {
      return request(app)
      .patch('/api/articles/74')
      .send({
        inc_votes: 15
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, msg: 'ID not found'});
      })
    })
    test('DELETE - /api/comments/:comment_id - check it return error when presented a valid but non existant comment_id', () => {
      return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg: 'ID not found'});
      })
    })
    test('DELETE - /api/comments/:comment_id - check it return error when presented a invalid comment_id', () => {
      return request(app)
      .delete('/api/comments/world')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
    test('GET - /api/users - return 400 if invalid file path', () => {
      return request(app)
      .get('/api/user')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg : 'Endpoint not found'})
      })
    })
    test('GET - /api/articles?topic - responds with 404 when provided a non existant topic', () => {
      return request(app)
      .get('/api/articles?topic=notATopic')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg: 'Topic not found'})
      })
    })
    test('GET - /api/articles?sort_by - responds with 404 when provided an invalid sort_by query', () => {
      return request(app)
      .get('/api/articles?sort_by=notASortByQuery')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg : 'Sort_by query not found'})
      })
    })
    test('GET - /api/articles?sort_by - responds with 404 when provided an invalid sort_by query', () => {
      return request(app)
      .get('/api/articles?order=lowestFirst')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, msg: 'Order query not found' })
      })
    })
    test('GET - /api/users/:username - checks for valid but no user with the username input', () => {
      return request(app)
      .get('/api/users/Frank')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg : 'Username not found'})
      })
    })
    test('PATCH - /api/comments/:comment_id - responds with 400 when proprty value is of another data type', () => {
      return request(app)
      .patch('/api/comments/1')
      .send({
        inc_votes: 'hello'
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
    test('PATCH - /api/comments/:comment_id - responds with 400 when comment_id is an invalid data type', () => {
      return request(app)
      .patch('/api/comments/hello')
      .send({
        inc_votes: 15
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
    test('PATCH - /api/comments/:comment_id - responds with 404 when comment_id is valid but not found', () => {
      return request(app)
      .patch('/api/comments/64')
      .send({
        inc_votes: 15
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, msg: 'ID not found'});
      })
    }),
    test('GET - /api/articles?limit=10&p=0 - responds with a 400 when accessing page 0', () => {
      return request(app)
      .get('/api/articles?p=0')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'p must be greater than 0'});
      })
    }),
    test('GET - /api/articles?limit=hello', () => {
      return request(app)
      .get('/api/articles?limit=hello')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'limit must be an integer'});
      })
    }),
    test('GET - /api/articles?p=world - responds with a 400 when entering the incorrect data type', () => {
      return request(app)
      .get('/api/articles?p=world')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'p must be an integer'});
      })
    }),
    test('GET - /api/articles?limit=-5 - responds with a 400 when attempting to enter a negative limit', () => {
      return request(app)
      .get('/api/articles?limit=-5')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'limit must not be less than 0'});
      })
    })
    test('GET - /api/articles/:article_id/comments?limit=-5 - responds with a 400 when attempting to enter a negative limit', () => {
      return request(app)
      .get('/api/articles/1/comments?limit=-5')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'limit must not be less than 0'});
      })
    })
    test('GET - /api/articles/:article_id/comments?p=0 - responds with a 400 when attempting to access page 0', () => {
      return request(app)
      .get('/api/articles/1/comments?p=0')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'p must be greater than 0'});
      })
    })   
    test('GET - /api/articles/:article_id/comments?limit=hello - responds with a 400 when entering the incorrect data type', () => {
      return request(app)
      .get('/api/articles/1/comments?limit=hello')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'limit must be an integer'});
      })
    })
    test('GET - /api/articles/:article_id/comments?p=world - responds with a 400 when entering the incorrect data type', () => {
      return request(app)
      .get('/api/articles/1/comments?p=world')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'p must be an integer'});
      })
    })
    test('POST - /api/topics - returns error 400 when assigning a slug to anything other than a string', () => {
      return request(app)
      .post('/api/topics')
      .send({
        slug: 0,
        description: 'description'
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'slug & description must be of type string' })
      })
    })
    test('POST - /api/topics - returns error 400 when assigning a description to anything other than a string', () => {
      return request(app)
      .post('/api/topics')
      .send({
        slug: 'slug',
        description: 0
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'slug & description must be of type string' })
      })
    })
    test('DELETE - /api/articles/:article_id - check it return error when presented a valid but non existant article_id', () => {
      return request(app)
      .delete('/api/articles/999')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg: 'ID not found'});
      })
    })
    test('DELETE - /api/articles/:article_id - check it return error when presented a invalid article_id', () => {
      return request(app)
      .delete('/api/articles/world')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
})
