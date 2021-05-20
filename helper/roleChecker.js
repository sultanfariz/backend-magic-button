const jwt = require('jsonwebtoken');
const { NotFoundError, WrongIdentityError } = require('../errors');
const { response } = require('../helper/bcrypt');
const { parseJwtPayload } = require('../helper/jwt');

module.exports = {
  checkAdmin: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) throw new NotFoundError('Token Not Found');

      console.log(parseJwtPayload(token));
      next();
    } catch (error) {
      if (error.name === 'NotFoundError')
        return response(res, {
          code: 401,
          success: false,
          message: error.message,
        });

      if (error.name === 'WrongIdentityError')
        return response(res, {
          code: 403,
          success: false,
          message: error.message,
        });
    }
  },
};
