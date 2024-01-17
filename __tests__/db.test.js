const request = require('supertest');
const app = require('../db/app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const allEndpoints = require('../endpoints.json');


afterAll(() => db.end());

beforeEach(() => seed(testData));

describe('app', () => {
  describe('topics', () => {
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
          expect(res.body.length).toBe(13);
          res.body.forEach((article) => {
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
         expect(res.body).toBeSortedBy('created_at', {descending: true})
          })
      })
      test('api/articles/:article_id/comments - responds with status code 200 & all comments for relevant article_id with most recent comments first', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({body}) => {
            expect(body.length).toBe(11);
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
  })

  //----------------Error Handling------------------------
  describe('general error handling', () => {
    test('API erros testing for incorrect file path', () => {
      return request(app)
        .get('/api/noTable')
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({status: 404, msg : 'Endpoint not found'});
        }) 
    })
    test('providing an invalid id - responds with a 404 and error message', () => {
      return request(app)
      .get('/api/articles/9999')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ status: 404, msg: 'Article ID not found'});
      })
    })
    test('providing an invalid id - responds with a 400 when testing with a different data type', () => {
      return request(app)
      .get('/api/articles/hello')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
      })
    })
    test('not providing an id - responds with a 400', () => {
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
      .post('/api/articles/9999/comments')
      .send(commentToAdd)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({status: 404, msg: 'Article ID not found'});
      })
    })
    test('providing an object to post with missing values', () => {
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
  })
})
