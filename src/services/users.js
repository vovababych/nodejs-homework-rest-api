const { UsersRepository } = require('../repository');

class UserService {
  constructor() {
    this.repository = {
      users: new UsersRepository(),
    };
  }

  async create(body) {
    const data = await this.repository.users.create(body);
    return data;
  }

  async findByEmail(email) {
    const data = await this.repository.users.findByEmail(email);
    return data;
  }

  async findById(id) {
    const data = await this.repository.users.findById(id);
    return data;
  }
}

module.exports = UserService;
