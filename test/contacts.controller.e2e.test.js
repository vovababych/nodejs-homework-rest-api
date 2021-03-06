const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = require('../app');
const { HttpCode } = require('../src/helpers/constants');
const {
  contacts: fakeContacts,
  newContact,
  User,
} = require('../src/services/__mocks__/fake-data');

const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, process.env.JWT_SECRET);
User.token = token;
console.log(`User.token`, User.token);

jest.mock('../src/services');
jest.mock('../src/helpers/guard', () => {
  return (req, res, next) => {
    req.user = { id: 1 };
    next();
  };
});

describe('Testing the route api/contacts', () => {
  let idNewContact;

  describe('should handle get request', () => {
    test('should return 200 status for get all contacts', async done => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
      done();
    });

    test('should return 200 status for get contact by ID', async done => {
      const contact = fakeContacts[0];
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact._id).toBe(contact._id);
      done();
    });

    test('should return 400 status for find contact by noValid ID', async done => {
      const notValidId = 12345;
      const res = await request(app)
        .get(`/api/contacts/${notValidId}`)
        .set('Authorization', `Bearer ${token}`)

        .set('Accept', 'application/json');
      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      done();
    });

    test('should return 404 status for find contact by noExist ID', async done => {
      const noExist = '111e111e1111111f11ed1c11';
      const res = await request(app)
        .get(`/api/contacts/${noExist}`)
        .set('Authorization', `Bearer ${token}`)

        .set('Accept', 'application/json');
      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe('should handle post request', () => {
    test('should return 201 status for crate contact', async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send(newContact)
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.CREATED);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe(newContact.name);
      expect(res.body.data.contact.email).toBe(newContact.email);
      expect(res.body.data.contact.phone).toBe(newContact.phone);
      expect(res.body.data.contact.subscription).toBe(newContact.subscription);
      idNewContact = res.body.data.contact._id;
    });

    test('should return 400 status for crate contact with wrong field', async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...newContact, test: 1 })
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for crate contact without required field name', async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Without' })
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status without required field phone', async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '1234567891' })
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status without required field email', async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: '1234567891' })
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });
  });

  describe('should handle patch request', () => {
    test('should return 200 status for update contact', async () => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'UpdateName' })
        .set('Accept', 'application/json');

      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe('UpdateName');
    });

    test('should return 400 status for update contact by wrong field', async () => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ test: 'No valid field' })
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });

    test('should return 400 status for update contact by noValid ID', async () => {
      const notValidId = 12345;
      const res = await request(app)
        .patch(`/api/contacts/${notValidId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });

    test('should return 404 status for update contact with noExist id', async () => {
      const noExist = '111e111e1111111f11ed1c11';
      const res = await request(app)
        .patch(`/api/contacts/${noExist}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'NoValidId' })
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
    });
  });

  describe('should handle delete request', () => {
    test('should return 200 status for delete contact', async () => {
      const res = await request(app)
        .delete(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(res.status).toEqual(200);
    });

    test('should return 400 status for delete contact by noValid ID', async () => {
      const notValidId = 12345;
      const res = await request(app)
        .delete(`/api/contacts/${notValidId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
    });

    test('should return 404 status for delete contact with noExist id', async () => {
      const noExist = '111e111e1111111f11ed1c11';
      const res = await request(app)
        .delete(`/api/contacts/${noExist}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(res.status).toEqual(HttpCode.NOT_FOUND);
    });
  });
});
