const { ContactsRepository } = require('../repository');

class ContactsService {
  constructor() {
    this.repository = {
      contacts: new ContactsRepository(),
    };
  }

  getAll() {
    const data = this.repository.contacts.getAll();
    return data;
  }

  getById({ contactId }) {
    const data = this.repository.contacts.getById(contactId);
    return data;
  }

  create(body) {
    const data = this.repository.contacts.create(body);
    return data;
  }

  update({ contactId }, body) {
    const data = this.repository.contacts.update(contactId, body);
    return data;
  }

  remove({ contactId }) {
    const data = this.repository.contacts.remove(contactId);
    return data;
  }
}

module.exports = ContactsService;
