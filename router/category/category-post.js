const router = require('express').Router();
const aunteficate = require('../../middlewares/aunteficate');
const { Category } = require('../../models');

router.post('/category', aunteficate(), async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = res.locals.user.id;
    const newCategory = {
      title,
      UserId: userId,
    };
    if (!title) {
      return res.status(403).json({ message: 'something went wrong' });
    }
    const category = await Category.create(newCategory);
    res.json(category);
  } catch (err) {
    return res.status(403).json({ message: 'something went wrong' });
  }
});

module.exports = router;
