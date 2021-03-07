const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = function authenticate(allowedRoles) {
  return (async (req, res, next) => {
    if (!('authorization' in req.headers)) {
      return res.status(403).send('Missing authorization header');
    }
    const token = req.headers.authorization;
    let payload;
    try {
      payload = jwt.verify(token, process.env.SALT || 'salt');
    } catch (err) {
      return res.status(403).send('Something went wrong');
    }

    const user = await User.findByPk(payload.id);
    if (!user) res.status(403).send('Something went wrong');

    res.locals.user = user;
    next();
  });
};
