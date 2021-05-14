const jwt = require('jsonwebtoken');
const { NotFoundError, WrongIdentityError } = require('../errors');
const { response} = require('../helper/bcrypt');

module.exports = {
  authenticateToken: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) throw new NotFoundError('Token Not Found');

      jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
        if (err) throw new WrongIdentityError('Your token doesn\'t matched our credentials');
        req.user = user;
        next();
      });
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

  generateAccessToken: (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
  },
};
