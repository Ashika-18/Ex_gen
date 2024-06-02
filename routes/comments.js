const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

// PostgreSQLモジュールを追加する
const { Pool } = require('pg');
const session = require('express-session');

//メッセージフォームの送信処理
router.post('/boards/comment/add/', (req, res, next) => {
    if (check (req, res)) { return };
    prisma.Comment.create({
        data: {
            authorId: req.body.id,
            messageId: req.body.msg.id,
            message: req.body.msg
        }
    }).then(() => {
        res.redirect('/boards');
    })
    .catch((err) => {
        res.redirect('/boards/add');
    })
});

module.exports = router;