const router = require('express').Router();
const { promises: fs } = require('fs');
const { Note } = require('../../models');

router.put('/note', async (req, res, next) => {
  try {
    const { id, path, CategoryId } = req.body;
    const oldNote = await Note.findByPk(id);
    if (!oldNote) {
      return res.status(403).json({ message: 'something went wrong' });
    }
    if (path) {
      await fs.writeFile(`${__dirname}/svg/${id}`, path);
    }
    const note = {
      CategoryId,
    };
    const [, newNote] = await Note.update(note, {
      where: { id }, returning: true,
    });
    res.json(newNote);
  } catch (err) {
    return res.status(403).json({ message: 'something went wrong' });
  }
});

module.exports = router;
