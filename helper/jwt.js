const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { NotFoundError, WrongIdentityError } = require('../errors');
const { response } = require('../helper/bcrypt');

module.exports = {
  authenticateToken: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      res.locals.token = authHeader && authHeader.split(' ')[1];
      if (res.locals.token == null) throw new NotFoundError('Token Not Found');

      jwt.verify(
        res.locals.token,
        process.env.ACCESS_JWT_SECRET,
        (err, user) => {
          if (err)
            throw new WrongIdentityError(
              "Your token doesn't matched our credentials"
            );
          req.user = user;
          next();
        }
      );
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

  parseJwtPayload: (token) => {
    return jwt_decode(token);
  },

  generateAccessToken: (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
  },
};
