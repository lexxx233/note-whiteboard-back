const router = require('express').Router();
const pdf = require('html-pdf');
const ejs = require('ejs');
const path = require('path');
const { promises: fs } = require('fs');
const aunteficate = require('../../middlewares/aunteficate');

const { Category, Note } = require('../../models');

router.get('/fetch-pdf', async (req, res) => {
  res.sendFile(`${__dirname}/report.pdf`);
});

router.get('/generateReport', aunteficate(), async (req, res) => {
  if (fs.access(`${__dirname}/report.pdf`)) {
    await fs.unlink(`${__dirname}/report.pdf`);
  }
  const userId = res.locals.user.id;
  const categories = await Category.findAll({
    order: [['title']],
    include: [{
      model: Note,
      as: 'taskIds',
      required: false,
      attributes: ['id'],
    }],
    where: { UserId: userId },
    raw: true,
  });
  if (!categories) {
    return res.status(403).json({ message: 'something went wrong' });
  }
  const mapAsync = (arr, func) => Promise.all(arr.map(func));
  await mapAsync(categories, async (category) => {
    if (!category['taskIds.id']) {
      category.svg = '';
      return null;
    }
    const id = category['taskIds.id'];
    category.svg = `${await fs.readFile(`${__dirname}/../note/svg/${id}`)}`;
  });

  ejs.renderFile(path.join(__dirname, './views/template.ejs'), { categories }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      const options = {
        height: '8.25in',
        width: '8.5in',
        header: {
          height: '20mm',
        },
        footer: {
          height: '20mm',
        },
      };
      pdf.create(data, options).toFile(`${__dirname}/report.pdf`, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.send('File created successfully');
        }
      });
    }
  });
});

module.exports = router;
