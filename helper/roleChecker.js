const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { NotFoundError, WrongIdentityError } = require('../errors');
const { response } = require('../helper/bcrypt');
const { parseJwtPayload } = require('../helper/jwt');

module.exports = {
  checkAdmin: async (req, res, next) => {
    try {
      const username = parseJwtPayload(res.locals.token).username;
      const user = await User.findOne({ username });
      if(username === null || user === null) throw new NotFoundError('Username Not Found');
      
      if(user.role === 'admin') next();
      else throw new WrongIdentityError('This user is not an admin');

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
