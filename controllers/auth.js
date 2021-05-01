const User = require('../models/User');
const { isEmpty, response, hashPassword } = require('../helper/bcrypt');
const { NotFoundError, WrongPasswordError } = require('../errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({
        $or: [
          {
            username
          },
          {
            email: username
          }
        ]
      });

      if (isEmpty(user)) throw new NotFoundError("Username or email doesn't exists!");

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) throw new WrongPasswordError('Your password not match with our records!');

      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken)

      const token = jwt.sign({ username: user.username }, process.env.ACCESS_JWT_SECRET);

      res.cookie('token', token, { httpOnly: true });
      return response(res, {
        code: 200,
        success: true,
        message: 'Login successfully!',
        content: {
          user,
          token
        }
      });
    } catch (error) {
      if (error.name === 'NotFoundError' || error.name === 'WrongPasswordError') {
        return response(res, {
          code: 400,
          success: false,
          message: error.message
        });
      }

      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong',
        content: error
      });
    }
  },
  // app.delete('/logout', 
  logout: async (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
  },
  
  register: async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const createdUser = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword
      });

      const token = jwt.sign({ username: createdUser.username }, process.env.ACCESS_JWT_SECRET);

      res.cookie('token', token, { httpOnly: true });
      return response(res, {
        code: 201,
        success: true,
        message: 'Register successfully!',
        content: {
          user: createdUser,
          token
        }
      });
    } catch (error) {
      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error
      });
    }
  }
};
