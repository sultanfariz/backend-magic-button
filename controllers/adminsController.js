const User = require('../models/User');
const Admin = require('../models/Admin');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');

module.exports = {
  addAdmin: async (req, res) => {
    const { username, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      let createdUser = await User.create({
        username,
        password: hashedPassword,
        role: 'admin',
      });

      const createdAdmin = await Admin.create({
        user: createdUser._id,
      });
      // create reference between Admin and User models
      createdUser.admin = createdAdmin._id;
      await createdUser.save();
      // prevent password to be showed in response
      createdUser.password = undefined;
      createdUser = JSON.parse(JSON.stringify(createdUser));

      return response(res, {
        code: 201,
        success: true,
        message: 'Successfully registered!',
        content: {
          user: { createdUser, createdAdmin },
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
