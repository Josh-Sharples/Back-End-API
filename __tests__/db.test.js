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
          expect(res.body[0]).toMatchObject({
            article_id: 3,
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            created_at: '2020-11-03T09:12:00.000Z',
            votes: 0,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: '2'
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
  })
})
