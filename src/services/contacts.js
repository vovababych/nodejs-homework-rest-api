const { ContactsRepository } = require('../repository');
// const db = require('../db');
const Contact = require('../schemas/contacts');

class ContactsService {
  constructor() {
    process.nextTick(async () => {
      // const client = await db;
      this.repository = {
        contacts: new ContactsRepository(Contact),
      };
    });
  }

  async getAll() {
    const data = await this.repository.contacts.getAll();
    console.log('data', data);
    return data;
  }

  async getById({ contactId }) {
    const data = await this.repository.contacts.getById(contactId);
    return data;
  }

  async create(body) {
    const data = await this.repository.contacts.create(body);
    return data;
  }

  async update({ contactId }, body) {
    const data = await this.repository.contacts.update(contactId, body);
    return data;
  }

  async remove({ contactId }) {
    const data = await this.repository.contacts.remove(contactId);
    return data;
  }
}

module.exports = ContactsService;
