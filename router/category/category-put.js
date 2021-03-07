const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const aunteficate = require('../../middlewares/aunteficate');

const { Category } = require('../../models');

router.put('/category', aunteficate(), async (req, res, next) => {
  try {
    const { id, title } = req.body;
    const oldCategory = await Category.findByPk(id);
    if (!oldCategory) {
      return res.status(403).json({ message: 'something went wrong' });
    }
    const [, newCategory] = await Category.update({ title }, {
      where: { id }, returning: true,
    });
    res.json(newCategory);
  } catch (err) {
    return res.status(403).json({ message: 'something went wrong' });
  }
});

module.exports = router;
