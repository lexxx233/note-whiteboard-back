const router = require('express').Router();

router.get('/', (req, res) => res.send('home'));
router.use('/', require('./auth/auth'));
router.use('/', require('./category/category-post'));
router.use('/', require('./category/category-get'));
router.use('/', require('./category/category-put'));
router.use('/', require('./category/category-delete'));
router.use('/', require('./note/note-post'));
router.use('/', require('./note/note-put'));
router.use('/', require('./note/note-delete'));
router.use('/', require('./export/export'));

module.exports = router;
