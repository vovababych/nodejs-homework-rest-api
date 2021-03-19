const errorHandler = (status, message, data = null) => {
  const error = new Error();
  error.status = status;
  error.message = message;
  error.data = data;
  throw error;
};

module.exports = errorHandler;
