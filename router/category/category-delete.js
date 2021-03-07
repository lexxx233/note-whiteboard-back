const router = require('express').Router();
const aunteficate = require('../../middlewares/aunteficate');

const { Category } = require('../../models');

router.delete('/category/:id', aunteficate(), async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) throw new Error();
    await Category.destroy({ where: { id: req.params.id } });
    res.send('category deleted');
  } catch (err) {
    return res.status(403).json({ message: 'something went wrong' });
  }
});

module.exports = router;
