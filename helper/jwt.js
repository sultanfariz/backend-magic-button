const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { NotFoundError, WrongIdentityError } = require('../errors');
const { response } = require('../helper/bcrypt');
const fetch = require('node-fetch');

module.exports = {
  // token signature authentication middleware by secret code
  authenticateToken: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      // create locals variable to pass it to next middleware
      res.locals.token = authHeader && authHeader.split(' ')[1];
      if (res.locals.token == null) throw new NotFoundError('Token Not Found');
      // verify the signature
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
  authenticateTokenIPB: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      // create locals variable to pass it to next middleware
      res.locals.token = authHeader && authHeader.split(' ')[1];
      if (res.locals.token == null) throw new NotFoundError('Token Not Found');
      // verify the signature
      const url =
        'http://api.ipb.ac.id/v1/Authentication/ValidateToken?token=' +
        res.locals.token;

      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-IPBAPI-Token': process.env.ACCESS_TOKEN,
        },
      });
      const data = await apiResponse.json();
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
    } finally {
      next();
    }
  },
  // decode payload jwt to get user data
  parseJwtPayload: (token) => {
    return jwt_decode(token);
  },
  // generate new jwt token which expires in 7 days
  generateAccessToken: (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
  },
};
