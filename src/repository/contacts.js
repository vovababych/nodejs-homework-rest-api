const { v4: uuid } = require('uuid');
const db = require('../db');

class ContactsRepository {
  getAll() {
    return db.get('contacts').value();
  }

  getById(id) {
    return db.get('contacts').find({ id }).value();
  }

  create(body) {
    const id = uuid();
    const record = {
      id,
      ...body,
    };
    db.get('contacts').push(record).write();
    return record;
  }

  update(id, body) {
    console.log('id', id);
    const record = db.get('contacts').find({ id }).assign(body).value();
    db.write();
    return record.id ? record : null;
  }

  remove(id) {
    const [record] = db.get('contacts').remove({ id }).write();
    return record;
  }
}

module.exports = ContactsRepository;
