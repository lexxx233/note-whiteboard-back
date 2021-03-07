const router = require('express').Router();
const { promises: fs } = require('fs');
const { Category, Note } = require('../../models');
const aunteficate = require('../../middlewares/aunteficate');

router.get('/category', aunteficate(), async (req, res, next) => {
  const board = {
    tasks: {

    },
    columns: {

    },
    columnOrder: [],
  };
  try {
    const userId = res.locals.user.id;

    const categories = await Category.findAll({
      order: [['id']],
      include: [{
        model: Note,
        as: 'taskIds',
        required: false,
        attributes: ['id'],
      }],
      where: { UserId: userId },
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
      //   path: note.dataValues.path,
      await Promise.all(notes.map(async (note) => {
        board.tasks[note.dataValues.id] = {
          id: `${note.dataValues.id}`,
          path: `${await fs.readFile(`${__dirname}/../note/svg/${note.dataValues.id}`)}`,
          CategoryId: note.dataValues.CategoryId,
        };
        return (note);
      }));
    }
    res.json(board);
  } catch (err) {
    return res.status(403).json({ message: err });
  }
});

module.exports = router;
