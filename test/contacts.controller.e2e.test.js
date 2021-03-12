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

jest.mock('../src/services');
jest.mock('../src/helpers/guard', () => {
  return (req, res, next) => {
    req.user = { id: 1 };
    next();
  };
});

describe('should handle get request api/contacts', () => {
  let idNewContact;

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

  test('should return 404 status for find contact by wrong ID', async done => {
    const wrongId = '111e111e1111111f11ed1c11';
    const res = await request(app)
      .get(`/api/contacts/${wrongId}`)
      .set('Authorization', `Bearer ${token}`)

      .set('Accept', 'application/json');
    expect(res.status).toEqual(HttpCode.NOT_FOUND);
    expect(res.body).toBeDefined();
    done();
  });

  test('should return 201 status for crate contact', async done => {
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
    done();
  });

  test('should return 400 status for wrong field', async done => {
    const res = await request(app)
      .post(`/api/contacts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...newContact, test: 1 })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(HttpCode.BAD_REQUEST);
    expect(res.body).toBeDefined();
    done();
  });

  test('should return 400 status without required field name', async done => {
    const res = await request(app)
      .post(`/api/contacts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Without' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(HttpCode.BAD_REQUEST);
    expect(res.body).toBeDefined();
    done();
  });
  test('should return 400 status without required field phone', async done => {
    const res = await request(app)
      .post(`/api/contacts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '1234567891' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(HttpCode.BAD_REQUEST);
    expect(res.body).toBeDefined();
    done();
  });

  test('should return 400 status without required field email', async done => {
    const res = await request(app)
      .post(`/api/contacts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: '1234567891' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(HttpCode.BAD_REQUEST);
    expect(res.body).toBeDefined();
    done();
  });

  test('should return 200 status update contact', async done => {
    const res = await request(app)
      .patch(`/api/contacts/${idNewContact}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'UpdateName' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    expect(res.body.data.contact.name).toBe('UpdateName');
    done();
  });

  test('should return 400 status for wrong field', async done => {
    const res = await request(app)
      .patch(`/api/contacts/${idNewContact}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ test: 1 })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(400);
    expect(res.body).toBeDefined();
    done();
  });

  it('should return 404 status with wrong id', async done => {
    const res = await request(app)
      .put(`/api/contacts/1234`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'NoValidId' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(404);
    expect(res.body).toBeDefined();
    done();
  });
});
