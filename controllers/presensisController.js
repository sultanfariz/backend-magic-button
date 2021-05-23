const Link = require('../models/Link');
const Vidcon = require('../models/Vidcon');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');

module.exports = {
  getAll: async (req, res) => {
    try {
      const users = await User.find();

      if (isEmpty(users)) {
        throw new NotFoundError('Users Not Found!');
      }

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get users data!',
        content: users,
      });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return response(res, {
          code: 404,
          success: false,
          message: error.message,
        });
      }

      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  },

  getOne: async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username });

      if (isEmpty(user))
        throw new NotFoundError(`User with username ${username} not found!`);

      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get ${username} data!`,
        content: user,
      });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return response(res, {
          code: 404,
          success: false,
          message: error.message,
        });
      }

      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  },

  checkPresensi: async (req, res) => {
    const { link, platform } = req.body;

    try {
      const createdLink = await Link.create({
        link,
        type: 'record',
      });

      const createdRecord = await Record.create({
        link: createdLink._id,
      });

      createdLink.record = createdRecord._id;
      await createdLink.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Link inserted successfully!',
        content: {
          link: { createdLink, createdRecord },
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

  update: async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, username, email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const updatedUser = await User.findOneAndUpdate(
        id,
        {
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
        },
        { new: true }
      );

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully update user',
        content: updatedUser,
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

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      await User.deleteOne({ _id: id });

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully delete user!',
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
