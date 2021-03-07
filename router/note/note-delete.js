const router = require('express').Router();
const { promises: fs } = require('fs');
const { Note } = require('../../models');

router.delete('/note/:id', async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) throw new Error();
    await Note.destroy({ where: { id: req.params.id } });
    await fs.unlink(`${__dirname}/svg/${req.params.id}`);
    res.send('note deleted');
  } catch (err) {
    return res.status(403).json({ message: 'something went wrong' });
  }
});

module.exports = router;
