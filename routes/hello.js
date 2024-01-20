const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    var data = {
        title: '-Hello!-',
        content: 'これは、サンプルのコンテンツですよ！<br>This is sample content'
    };
    res.render('hello', data);
});

module.exports = router;