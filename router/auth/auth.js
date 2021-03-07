const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models');

router.post('/login', [body('email').isEmail(),
  body('password').isLength({ min: 5 })], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user;
    try {
      const { email, password } = req.body;
      user = await User.authenticate(res, email, password);
    } catch (error) {
      return res.status(401).json({ message: 'wrong email or password' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = User.generateToken(user);
    delete user.dataValues.password;
    return res.json({ authorization: token, user });
  } catch (err) {
    return res.status(401).json({ message: 'something went wrong' });
  }
});

router.post('/signup', [body('email').isEmail(),
  body('password').isLength({ min: 5 })], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userData = req.body;
    userData.password = await bcrypt.hash(req.body.password, 8);
    userData.email = userData.email && userData.email.toLowerCase();
    const user = await User.create(userData);
    const token = User.generateToken(user);
    return res.json({
      user,
      authorization: token,
    });
  } catch (err) {
    return res.status(403).json({ message: 'something went wrong' });
  }
});

module.exports = router;
