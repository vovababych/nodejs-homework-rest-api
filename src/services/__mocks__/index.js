const { contacts } = require('./fake-data');

const mockGetAll = jest.fn(() => {
  return { total: contacts.length, limit: 5, page: 1, contacts };
});

const mockGetById = jest.fn((userId, { contactId }) => {
  const [contact] = contacts.filter(el => String(el._id) === String(contactId));
  return contact;
});

const mockCreate = jest.fn((userId, body) => {
  contacts.push({ ...body, _id: '5eb074232c30a1378dacdbdd' });
  return { ...body, _id: '5eb074232c30a1378dacdbdd' };
});

const mockUpdate = jest.fn((userId, { contactId }, body) => {
  const [contact] = contacts.filter(el => String(el._id) === String(contactId));
  if (contact) {
    contact.name = body.name;
  }
  return contact;
});

const mockRemove = jest.fn((userId, contactId) => {
  const index = contacts.findIndex(el => String(el._id) === String(contactId));
  if (index !== -1) {
    const [contact] = contacts.splice(index, 1);
    return contact;
  }
  return null;
});

const ContactsService = jest.fn().mockImplementation(() => {
  return {
    getAll: mockGetAll,
    getById: mockGetById,
    create: mockCreate,
    update: mockUpdate,
    remove: mockRemove,
  };
});
const UserService = jest.fn().mockImplementation(() => {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateUser: jest.fn(),
    updateAvatar: jest.fn(),
  };
});
const AuthService = jest.fn().mockImplementation(() => {
  return {
    login: jest.fn(),
    logout: jest.fn(),
  };
});

module.exports = {
  ContactsService,
  UserService,
  AuthService,
};
