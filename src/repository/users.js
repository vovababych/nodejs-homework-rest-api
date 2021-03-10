const UserModel = require('../schemas/user');

class UsersRepository {
  constructor() {
    this.model = UserModel;
  }

  async findById(id) {
    const result = await this.model.findOne({ _id: id });
    return result;
  }

  async findByEmail(email) {
    const result = await this.model.findOne({ email });
    return result;
  }

  async create(body) {
    const user = new this.model(body);
    return user.save();
  }

  async updateToken(id, token) {
    await this.model.updateOne({ _id: id }, { token });
  }

  async updateSubscription(userId, subscription) {
    await this.model.updateOne({ _id: userId }, { subscription });
  }

  async updateAvatar(userId, avatar) {
    await this.model.updateOne({ _id: userId }, { avatar });
  }
}

module.exports = UsersRepository;
