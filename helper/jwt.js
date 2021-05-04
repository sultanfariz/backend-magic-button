const jwt = require('jsonwebtoken');

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader);
    console.log(authHeader.split(' ')[1]);
    console.log(token);
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  },

  generateAccessToken: (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
  },
};
