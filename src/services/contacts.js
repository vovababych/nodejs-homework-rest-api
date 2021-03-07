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

  async getAll(userId, query) {
    const data = await this.repository.contacts.getAll(userId, query);
    const { docs: contacts, totalDocs: total, limit, offset } = data;
    return {
      contacts,
      total,
      limit,
      offset,
    };
  }

  // async getAll(userId, query) {
  //   const data = await this.repository.contacts.getAll(userId, query);
  //   return data;
  // }

  async getById(userId, { contactId }) {
    const data = await this.repository.contacts.getById(userId, contactId);
    return data;
  }

  async create(userId, body) {
    const data = await this.repository.contacts.create(userId, body);
    return data;
  }

  async update(userId, { contactId }, body) {
    const data = await this.repository.contacts.update(userId, contactId, body);
    return data;
  }

  async remove(userId, contactId) {
    const data = await this.repository.contacts.remove(userId, contactId);
    return data;
  }
}

module.exports = ContactsService;
