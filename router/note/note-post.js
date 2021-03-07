const router = require('express').Router();
const { promises: fs } = require('fs');
const { Note, Category } = require('../../models');

router.post('/note', async (req, res, next) => {
  try {
    const { path, CategoryId } = req.body;
    if (!CategoryId) {
      return res.status(403).json({ message: 'something went wrong' });
    }

    const newNote = {
      path: '',
      CategoryId,
    };
    const curNote = await Note.create(newNote);
    await fs.writeFile(`${__dirname}/svg/${curNote.id}`, path || '');

    const board = {
      tasks: {

      },
      columns: {

      },
      columnOrder: [],
    };
    try {
      const categories = await Category.findAll({
        order: [['id']],
        include: [{
          model: Note,
          as: 'taskIds',
          required: false,
          attributes: ['id'],
        }],
      });

      if (!categories) {
        return res.status(403).json({ message: 'something went wrong' });
      }
      const notes = await Note.findAll({
        order: [['id']],
        attributes: ['id', 'path', 'CategoryId'],
      });

      const newCategories = categories.map((i) => {
        const newColumns = {
          id: `CategoryId${i.dataValues.id}`,
          title: i.dataValues.title,
          taskIds: [],
        };
        const newTaskIdList = [];
        if (i.dataValues.taskIds && i.dataValues.taskIds.length > 0) {
          const newTaskid = i.dataValues.taskIds.map((task) => {
            newTaskIdList.push(task.dataValues.id);
            return newTaskIdList;
          });
          newColumns.taskIds = newTaskIdList;
        }
        board.columnOrder.push(`CategoryId${i.dataValues.id}`);
        board.columns[`CategoryId${i.dataValues.id}`] = newColumns;
        return (
          board
        );
      });
      if (notes) {
        notes.map((note) => {
          board.tasks[note.dataValues.id] = {
            id: `${note.dataValues.id}`,
            path: note.dataValues.path,
            CategoryId: note.dataValues.CategoryId,

          };
          return (note);
        });
      }
      res.json(board);
    } catch (err) {
      return res.status(403).json({ message: 'something went wrong' });
    }
  } catch (err) {
    return res.status(403).json({ message: 'something went wrong' });
  }
});

module.exports = router;
