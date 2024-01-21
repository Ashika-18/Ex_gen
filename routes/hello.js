const express = require('express');
const router = express.Router();

router.get('/ok', (req, res, next) => {
    var msg = 'メッセージを入力して下さい。';
    if (req.session.message != undefined) {
        msg = "Last Message:" + req.session.message;
    }
    
    var data = {
        title: '-Hello!-',
        content: msg
    };
    res.render('hello', data);
});

router.post('/ok/post', (req, res, next) => {
    var msg = req.body['message'];
    req.session.message = msg;
    var data = {
        title: '--Hello!--',
        content: "Last Message:" + req.session.message
    };
    res.render('hello', data);
});

module.exports = router;