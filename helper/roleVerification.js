const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { NotFoundError, WrongIdentityError } = require('../errors');
const { response } = require('./bcrypt');
const { parseJwtPayload } = require('./jwt');

module.exports = {
  // middleware to verify user by its role
  verifyRole: (role) => {
    return async (req, res, next) => {
      try {
        // use locals variable from previous middleware
        const username = parseJwtPayload(res.locals.token).username;
        const tokenrole = parseJwtPayload(res.locals.token).role;
        const user = await User.findOne({ username });
        if (username === null || user === null)
          throw new NotFoundError('Username Not Found');
  
        if (tokenrole === role) next();
        else throw new WrongIdentityError(`This user is not an ${role}`);
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
    }
  }
};
