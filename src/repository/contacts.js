class ContactsRepository {
  constructor(ContactModel) {
    this.model = ContactModel;
  }

  async getAll() {
    const results = await this.model.find({});
    return results;
  }

  async getById(id) {
    // const [result] = await this.model.find({ _id: id });
    const result = await this.model.findOne({ _id: id });
    return result;
  }

  async create(body) {
    const result = await this.model.create(body);
    return result;
  }

  async update(id, body) {
    // const result = await this.model.findOneAndUpdate( { _id: id }, {...body}, { new: true }) {
    const result = await this.model.findByIdAndUpdate(
      id,
      { ...body },
      { new: true },
    );
    return result;
  }

  async remove(id) {
    const result = await this.model.findByIdAndRemove(id);

    return result;
  }
}

module.exports = ContactsRepository;

// ---------------------mongodb---------------------

// const { ObjectID } = require('mongodb');

// class ContactsRepository {
//   constructor(client) {
//     this.collection = client.db().collection('contacts');
//   }

//   async getAll() {
//     const results = await this.collection.find({}).toArray();
//     return results;
//   }

//   async getById(id) {
//     const objectId = new ObjectID(id);
//     console.log(objectId.getTimestamp());
//     const [result] = await this.collection.find({ _id: objectId }).toArray();
//     return result;
//   }

//   async create(body) {
//     const record = {
//       ...body,
//     };
//     const {
//       ops: [result],
//     } = await this.collection.insertOne(record);
//     return result;
//   }

//   async update(id, body) {
//     const objectId = new ObjectID(id);
//     const { value: result } = await this.collection.findOneAndUpdate(
//       { _id: objectId },
//       { $set: body },
//       { returnOriginal: false },
//     );

//     return result;
//   }

//   async remove(id) {
//     const objectId = new ObjectID(id);
//     const { value: result } = await this.collection.findOneAndDelete({
//       _id: objectId,
//     });

//     return result;
//   }
// }

// module.exports = ContactsRepository;
