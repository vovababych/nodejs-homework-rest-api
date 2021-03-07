class ContactsRepository {
  constructor(ContactModel) {
    this.model = ContactModel;
  }

  async getAll(userId, { limit = 5, offset = 0, sortBy, sortByDesc, filter }) {
    const result = await this.model.paginate(
      { owner: userId },
      {
        limit,
        offset,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
        },
        select: filter ? filter.split('|').join(' ') : '',
        populate: {
          path: 'owner',
          select: 'name email subscription -_id',
        },
      },
    );
    return result;
  }

  // async getAll({
  //   limit = 5,
  //   offset = 0,
  //   page = 1,
  //   sortBy,
  //   sortByDesc,
  //   filter,
  // }) {
  //   const { docs: contacts, totalDocs: total } = await this.model.paginate(
  //     {},
  //     {
  //       limit,
  //       offset,
  //       page,
  //       sort: {
  //         ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
  //         ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
  //       },
  //       select: filter ? filter.split('|').join(' ') : '',
  //       populate: {
  //         path: 'owner',
  //         select: 'name email subscription -_id',
  //       },
  //     },
  //   );
  //   return {
  //     contacts,
  //     total,
  //     limit: Number(limit),
  //     offset: Number(offset),
  //     page: Number(page),
  //   };
  // }

  async getById(userId, id) {
    // const [result] = await this.model.find({ _id: id });
    const result = await this.model
      .findOne({ _id: id, owner: userId })
      .populate({
        path: 'owner',
        select: 'name email subscription -_id',
      });
    return result;
  }

  async create(userId, body) {
    const result = await this.model.create({ owner: userId, ...body });
    return result;
  }

  async update(userId, id, body) {
    // const result = await this.model.findOneAndUpdate( { _id: id }, {...body}, { new: true }) {
    const result = await this.model.findByIdAndUpdate(
      { id, owner: userId },
      { ...body },
      { new: true },
    );
    return result;
  }

  async remove(userId, id) {
    const result = await this.model.findByIdAndRemove({ id, owner: userId });

    return result;
  }
}

module.exports = ContactsRepository;
