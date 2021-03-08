class ContactsRepository {
  constructor(ContactModel) {
    this.model = ContactModel;
  }

  async getAll(userId, query) {
    const { limit = 5, page = 1, sortBy, sortByDesc, filter, Sub } = query;

    const queryBySubscription = Sub
      ? { owner: userId, subscription: Sub }
      : { owner: userId };

    const result = await this.model.paginate(queryBySubscription, {
      limit,
      page,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}), // name: 1
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}), // name: -1
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
        path: 'owner',
        select: 'name email subscription -_id',
      },
    });
    return result;
  }

  async getById(userId, id) {
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
    const result = await this.model.findOneAndUpdate(
      { _id: id, owner: userId },
      { ...body },
      { new: true },
    );
    return result;
  }

  async remove(userId, id) {
    const result = await this.model.findOneAndRemove({
      _id: id,
      owner: userId,
    });

    return result;
  }
}

module.exports = ContactsRepository;
