const express = require('express');
const router = express.Router();

router.get('/ok', (req, res, next) => {
    var data = {
        title: '-Hello!-',
        content: 'メッセージを入力して下さい。' 
    }
    res.render('hello', data);
});

router.post('/ok/post', (req, res, next) => {
    var msg = req.body['message'];
    var data = {
        title: '--Hello!--',
        content: 'あなたは、「' + msg + '」と送信しましたねぇ🫠'
    };
    res.render('hello', data);
});

module.exports = router;