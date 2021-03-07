const { UsersRepository } = require('../repository');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

class AuthService {
  constructor() {
    this.repository = {
      users: new UsersRepository(),
    };
  }

  async login({ email, password }) {
    const user = await this.repository.users.findByEmail(email);
    if (!user || !user.validPassword(password)) {
      return { user: null, token: null };
    }
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '5h' });
    await this.repository.users.updateToken(id, token);
    return { token, user };
  }

  async logout(id) {
    await this.repository.users.updateToken(id, null);
  }
}

module.exports = AuthService;
