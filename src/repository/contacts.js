const { ObjectID } = require('mongodb');

class ContactsRepository {
  constructor(client) {
    this.collection = client.db().collection('contacts');
  }

  async getAll() {
    const results = await this.collection.find({}).toArray();
    console.log('results', results);
    return results;
  }

  async getById(id) {
    const objectId = ObjectID(id);
    const [result] = await this.collection.find({ _id: objectId }).toArray();
    return result;
  }

  async create(body) {
    const record = {
      ...body,
    };
    const {
      ops: [result],
    } = await this.collection.insertOne(record);
    return result;

    // db.get('contacts').push(record).write();
    // return record;
  }

  async update(id, body) {
    // console.log('id', id);
    // const record = db.get('contacts').find({ id }).assign(body).value();
    // db.write();
    // return record.id ? record : null;
  }

  async remove(id) {
    //   const [record] = db.get('contacts').remove({ id }).write();
    //   return record;
  }
}

module.exports = ContactsRepository;
