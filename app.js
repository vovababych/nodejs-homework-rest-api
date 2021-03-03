const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const usersRouter = require('./src/api/users');
const contactsRouter = require('./src/api/contacts');
const { HttpCode } = require('./src/helpers/constants');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(logger('combined', { stream: accessLogStream }));
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((_req, res, next) => {
  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    data: 'Not found',
  });
});

app.use((err, _req, res, _next) => {
  err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR;
  res.status(err.status).json({
    status: err.status === 500 ? 'fail' : 'error',
    code: err.status,
    message: err.message,
    data: err.status === 500 ? 'Internal Server Error' : err.data,
  });
});

module.exports = app;
