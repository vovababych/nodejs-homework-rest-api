const e = require('express');
const { nanoid } = require('nanoid');
const { UsersRepository } = require('../repository');
const EmailService = require('./email');
const errorHandler = require('../helpers/error');

class UserService {
  constructor() {
    this.repository = {
      users: new UsersRepository(),
    };
    this.emailService = new EmailService();
  }

  async findById(id) {
    const data = await this.repository.users.findById(id);
    return data;
  }

  async findByEmail(email) {
    const data = await this.repository.users.findByEmail(email);
    return data;
  }

  async create(body) {
    const verifyToken = nanoid();
    const { email, name } = body;
    try {
      await this.emailService.sendEmail(verifyToken, email, name);
    } catch (e) {
      errorHandler(503, e.message, 'Service Unavalaible');
    }
    const data = await this.repository.users.create({ ...body, verifyToken });
    return data;
  }

  async updateUser(userId, body) {
    const data = await this.repository.users.updateUser(userId, body);
    return data;
  }

  async updateAvatar(userId, avatarURL) {
    await this.repository.users.updateAvatar(userId, avatarURL);
  }

  async verify({ token }) {
    const user = await this.repository.users.findByField({
      verifyToken: token,
    });
    if (user) {
      await user.updateOne({ isVerify: true, verifyToken: null });
      return true;
    }
    return false;
  }
}

module.exports = UserService;
