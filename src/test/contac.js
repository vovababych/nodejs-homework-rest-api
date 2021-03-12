// const request = require('supertest');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const { User } = require('../__mocks__/fake-data');
// const app = require('../../app');

// const SECRET_KEY = process.env.JWT_SECRET;
// const issueToken = (payload, secret) => jwt.sign(payload, secret);
// const token = issueToken({ id: User._id }, SECRET_KEY);
// User.token = token;

// jest.mock('../services/contacts.js');
// jest.mock('../services/users.js');

// describe('Testing the route api/contacts', () => {
//   describe('Should handle get request', () => {
//     test('should return 200 status for get all contacts', async done => {
//       const res = await request(app)
//         .get('/api/contacts')
//         .set('Authorization', `Bearer ${token}`);

//       expect(res.status).toEqual(200);
//       expect(res.body).toBeDefined();
//       expect(res.body.data.contacts).toBeInstanceOf(Array);
//       done();
//     });
//   });
//   describe('Should handle post request', () => {});
//   describe('Should handle put request', () => {});
//   describe('Should handle patch request', () => {});
//   describe('Should handle delete request', () => {});
// });
