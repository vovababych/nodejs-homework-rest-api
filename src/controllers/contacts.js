const { HttpCode } = require('../helpers/constants');
const { ContactsService } = require('../services');
const contactsService = new ContactsService();

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id; // В guard.js user положили в req.user
    const contacts = await contactsService.getAll(userId, req.query);
    const message =
      contacts.length > 0 ? 'Contacts list' : 'Contacts list is empty';
    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message,
      data: {
        ...contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id; // В guard.js user положили в req.user
    const contact = await contactsService.getById(userId, req.params);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Сontact found',
        data: {
          contact,
        },
      });
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Contact not found by id',
        data: 'Not Found By Id',
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id; // В guard.js user положили в req.user
    const contact = await contactsService.create(
      userId,
      req.body,
      // {owner: userId, ...req.body }
    );
    res.status(HttpCode.CREATED).json({
      status: 'created',
      code: HttpCode.CREATED,
      message: 'Сontact created',
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id; // В guard.js user положили в req.user
    const contact = await contactsService.update(userId, req.params, req.body);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Сontact update',
        data: {
          contact,
        },
      });
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Contact not found by id for update',
        data: 'Not Found By Id for update',
      });
    }
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id; // В guard.js user положили в req.user
    const contact = await contactsService.remove(req.params.id, userId);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Сontact deleted',
        data: {
          contact,
        },
      });
    } else {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Contact not found by id for delete',
        data: 'Not Found By Id  for delete',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
