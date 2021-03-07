const passport = require('passport');
require('../config/passport');
const { HttpCode } = require('../helpers/constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    /*
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1] // [0]-Bearer, [1]-token
      : null;
      */

    // const [, token] = req.get('Authorization').split(' ');

    const token = req.get('Authorization').split(' ')[1]; // [0]-Bearer, [1]-token
    if (!user || err || token !== user.token) {
      next({
        status: HttpCode.UNAUTHORIZED,
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'Not authorized',
      });
      // return res.status(HttpCode.UNAUTHORIZED).json({
      //   status: 'error',
      //   code: HttpCode.UNAUTHORIZED,
      //   data: 'UNAUTHORIZED',
      //   message: 'Not authorized',
      // });
    }
    req.user = user;
    // res.locals.user=user переменная на текущем запросе
    // req.app.locals.vars - глобальная переменная
    return next();
  })(req, res, next);
};

module.exports = guard;
