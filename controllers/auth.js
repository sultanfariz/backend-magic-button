const User = require('../models/User');
const { isEmpty, response, hashPassword } = require('../helper/bcrypt');
const { NotFoundError, WrongPasswordError } = require('../errors');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({username});
      //login mahasiswa ipb 
      if (isEmpty(user)){
        // throw new NotFoundError("Username doesn't exists!");
        const apiBody = {Username: username, Password: password }
        const apiResponse = await fetch("http://api.ipb.ac.id/v1/Authentication/LoginMahasiswa", {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'X-IPBAPI-Token': 'Bearer 6454b1ff-7dce-396d-9b07-4f88248072b6'
          },
          body: JSON.stringify(apiBody)
        })
        if (apiResponse.status === 200){
          const data = await apiResponse.json();
          // store the token in user browser cookie
          res.cookie('token', data["Token"], { httpOnly: true });
          return response(res, {
            code: 200,
            success: true,
            message: 'Login successfully!',
            content: {
              data
            },
          });
        }
      }
      // compare user-inputed password with database password
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword)
        throw new WrongPasswordError(
          'Your password doesn\'t match with our records!'
        );

      // const accessToken = generateAccessToken(user);
      // const refreshToken = jwt.sign(user, process.env.REFRESH_JWT_SECRET);
      // refreshTokens.push(refreshToken);

      // create new jwt token
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.ACCESS_JWT_SECRET
      );
      // store the token in user browser cookie
      res.cookie('token', token, { httpOnly: true });
      return response(res, {
        code: 200,
        success: true,
        message: 'Login successfully!',
        content: {
          token,
        },
      });
    } catch (error) {
      if (
        error.name === 'NotFoundError' ||
        error.name === 'WrongPasswordError'
      ) {
        return response(res, {
          code: 400,
          success: false,
          message: error.message,
        });
      }

      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong',
        content: error,
      });
    }
  },
  // logout user by deleting browser cookie
  logout: async (req, res) => {
    res.status(202).clearCookie('token');
    return response(res, {
      code: 202,
      success: true,
      message: 'Cookie has been cleared',
      content: null,
    });
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
        password: hashedPassword,
      });

      const token = jwt.sign(
        { username: createdUser.username },
        process.env.ACCESS_JWT_SECRET
      );

      res.cookie('token', token, { httpOnly: true });
      return response(res, {
        code: 201,
        success: true,
        message: 'Register successfully!',
        content: {
          user: createdUser,
          token,
        },
      });
    } catch (error) {
      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  },
};
