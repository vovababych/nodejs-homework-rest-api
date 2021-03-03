const passport = require('passport');
require('../config/passport');
const { HttpCode } = require('../helpers/constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    // const [, token] = req.get('Authorization').split(' ');
    if (
      !user ||
      err
      // || token !== user.token
    ) {
      return res.status(HttpCode.FORBIDDEN).json({
        status: 'error',
        code: HttpCode.FORBIDDEN,
        data: 'Forrbidden',
        message: 'Access is denied',
      });
    }
    req.user = user;
    // res.locals.user=user переменная на текущем запросе
    // req.app.locals.vars - глобальная переменная
    return next();
  })(req, res, next);
};

module.exports = guard;
