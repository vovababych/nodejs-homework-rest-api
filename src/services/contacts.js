const { ContactsRepository } = require('../repository');
const ContactModel = require('../schemas/contacts');

class ContactsService {
  constructor() {
    process.nextTick(async () => {
      this.repository = {
        contacts: new ContactsRepository(ContactModel),
      };
    });
  }

  async getAll() {
    const data = await this.repository.contacts.getAll();
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

// -------------------------mongoDb-------------------------

// const { ContactsRepository } = require('../repository');
// // const db = require('../db');

// class ContactsService {
//   constructor() {
//     process.nextTick(async () => {
//       const client = await db;
//       this.repository = {
//         contacts: new ContactsRepository(client),
//       };
//     });
//   }
// async getAll() { }
// async getById({ contactId }) { }
// async create(body) { }
// async update({ contactId }, body) { }
// async remove({ contactId }) { }
// }
// module.exports = ContactsService;
