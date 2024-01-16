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
          })
        })
    })
   test('api/articles/:article_id', () => {
      return request(app)
        .get('/api/articles/8')
        .expect(200)
        .then(({body}) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 8,
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
          expect(res.body).toEqual({msg : 'Endpoint not found'});
        }) 
    })
    test('providing an invalid id - responds with a 400 and error message', () => {
      return request(app)
      .get('/api/articles/9999999')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
        expect(res.body.msg).toBe('Bad request');
      })
    })
    test('providing an invalid id - responds with a 400 and error message when out of range for integer', () => {
      return request(app)
      .get('/api/articles/9999999999999999999')
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ status: 400, msg: 'Bad request'});
        expect(res.body.msg).toBe('Bad request');
      })
    })
  })
})
