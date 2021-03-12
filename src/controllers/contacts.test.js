const contacts = require('./contacts');
const { HttpCode } = require('../helpers/constants');
const { ContactsService } = require('../services');
const {
  contacts: fakeContacts,
  newContact,
} = require('../services/__mocks__/fake-data');

jest.mock('../services');

describe('Unit testing contacts controllers', () => {
  let req, res, next;
  beforeEach(() => {
    req = { user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(data => data),
    };
    next = jest.fn();
  });

  test('should get all contacts', async () => {
    const result = await contacts.getAll(req, res, next);
    expect(ContactsService).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toHaveProperty('status', 'success');
    expect(result).toHaveProperty('code', 200);
    expect(result).toHaveProperty('data');
  });

  test('should get error when get all contacts', async () => {
    const result = await contacts.getAll({}, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('should found contacts by ID', async () => {
    const { _id, name, email, phone, sex, subscription } = fakeContacts[0];
    req.params = { contactId: _id };
    const result = await contacts.getById(req, res, next);
    expect(ContactsService).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.data.contact).toHaveProperty('_id', _id);
    expect(result.data.contact).toHaveProperty('name', name);
    expect(result.data.contact).toHaveProperty('email', email);
    expect(result.data.contact).toHaveProperty('phone', phone);
    expect(result.data.contact).toHaveProperty('sex', sex);
    expect(result.data.contact).toHaveProperty('subscription', subscription);
  });

  test('should found contacts by wrong ID', async () => {
    req.params = { contactId: 1 };
    const result = await contacts.getById(req, res, next);
    expect(ContactsService).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({
      status: HttpCode.NOT_FOUND,
      message: 'Contact not found by id',
      data: 'Not Found By Id',
    });
  });

  test('should create new contact', async () => {
    const { name, email, phone, sex, subscription } = newContact;
    req.body = newContact;
    const result = await contacts.create(req, res, next);
    expect(ContactsService).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.data.contact).toHaveProperty('_id');
    expect(result.data.contact).toHaveProperty('name', name);
    expect(result.data.contact).toHaveProperty('email', email);
    expect(result.data.contact).toHaveProperty('phone', phone);
    expect(result.data.contact).toHaveProperty('sex', sex);
    expect(result.data.contact).toHaveProperty('subscription', subscription);
  });

  test('should update contact', async () => {
    const { _id } = fakeContacts[0];
    req.params = { contactId: _id };
    const name = 'UpdateNameContact';
    req.body = { name };
    const result = await contacts.update(req, res, next);
    expect(ContactsService).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.data.contact).toHaveProperty('_id', _id);
    expect(result.data.contact).toHaveProperty('name', name);
  });

  test('should update contact by wrong ID', async () => {
    req.params = { contactId: 1 };
    const result = await contacts.update(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({
      status: HttpCode.NOT_FOUND,
      message: 'Contact not found by id for update',
      data: 'Not Found By Id for update',
    });
  });

  test('should remove contact by ID', async () => {
    const { _id, name, email, phone } = fakeContacts[0];
    req.params = { contactId: _id };
    const result = await contacts.remove(req, res, next);
    expect(ContactsService).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.data.contact).toHaveProperty('name', name);
    expect(result.data.contact).toHaveProperty('email', email);
    expect(result.data.contact).toHaveProperty('phone', phone);
  });

  test('should remove contact by wrong ID', async () => {
    req.params = { contactId: 1 };
    const result = await contacts.remove(req, res, next);
    console.log('result', result);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({
      status: HttpCode.NOT_FOUND,
      message: 'Contact not found by id for delete',
      data: 'Not Found By Id  for delete',
    });
  });
});
