const { HttpCode } = require('../helpers/constants');
const { ContactsService } = require('../services');
const contactsService = new ContactsService();

const getAll = (req, res, next) => {
  try {
    const contacts = contactsService.getAll();
    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};
const getById = (req, res, next) => {
  try {
    const contact = contactsService.getById(req.params);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
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
const create = (req, res, next) => {
  try {
    const contact = contactsService.create(req.body);
    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};
const update = (req, res, next) => {
  try {
    const contact = contactsService.update(req.params, req.body);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
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
const remove = (req, res, next) => {
  try {
    const contact = contactsService.remove(req.params);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
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
