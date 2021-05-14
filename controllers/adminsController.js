const User = require('../models/User');
const Admin = require('../models/Admin');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');

module.exports = {
  addAdmin: async (req, res) => {
    const { username, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const createdUser = await User.create({
        username,
        password: hashedPassword,
        role: "admin"
      });
      
      const createdAdmin = await Admin.create({
        user: createdUser._id
      });

      createdUser.admin = createdAdmin._id;
      await createdUser.save();

      // const token = jwt.sign(
      //   { username: createdUser.username },
      //   process.env.ACCESS_JWT_SECRET
      // );

      // res.cookie('token', token, { httpOnly: true });
      return response(res, {
        code: 201,
        success: true,
        message: 'Register successfully!',
        content: {
          user: { createdUser, createdAdmin },
          // token,
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
  /**
   * Update user data
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Express.Response} Return updated user data
   */
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
  /**
   * Delete user data from database
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   *
   * @returns {Express.Response} Return success messages after delete user
   */
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
