const { HttpCode } = require('../helpers/constants');
const { ContactsService } = require('../services');
const contactsService = new ContactsService();

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await contactsService.getAll(userId);
    const message =
      contacts.length > 0 ? 'Contacts list' : 'Contacts list is empty';
    res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await contactsService.getById(req.params, userId);
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
    const userId = req.user.id;
    const contact = await contactsService.create(
      req.body,
      userId,
      // {...req.body, owner: userId}
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
    const userId = req.user.id;
    const contact = await contactsService.update(req.params, req.body, userId);
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
    const userId = req.user.id;
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
