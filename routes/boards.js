const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

// PostgreSQLモジュールを追加する
const { Pool } = require('pg');

const pnum = 5;

//ログインのチェック
function check (req, res) {
    if (req.session.login == null) {
        req.session.back = '/boards';
        res.redirect('/users/login');
        return true;
    } else {
        return false;
    }
}

//TOPページ
router.get('/', (req, res, next) => {
    res.redirect('/boards/0');
});

//TOPページにページ番号をつけてアクセス
router.get('/:page', (req, res, next) => {

    if (check(req, res)) { return };
    const pg = +req.params.page;
    prisma.Board.count().then(totalCount => {
        const totalPageCount = Math.ceil(totalCount / pnum);
        const hasNextPage = pg < totalPageCount;
        const currentPage = pg;

    prisma.Board.findMany({
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            { createdAt: 'desc' }
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const hasNextPage = currentPage < totalPageCount;
        var data = {
            title: 'Boards',
            login: req.session.login,
            content: brds,
            page: pg,
            hasNextPage: hasNextPage
        }
        res.render('boards/index', data);
    });
    });
});

//メッセージフォームの送信処理
router.post('/add', (req, res, next) => {
    if (check (req, res)) { return };
    prisma.Board.create({
        data: {
            accountId: req.session.login.id,
            message: req.body.msg
        }
    }).then(() => {
        res.redirect('/boards');
    })
    .catch((err) => {
        res.redirect('/boards/add');
    })
});

//利用者のホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
    const pg = +req.params.page;
    const id = +req.params.id;

    prisma.Board.count({ where: { accountId: id } }).then(totalCount => {
        const totalPageCount = Math.ceil(totalCount / pnum);
        const hasNextPage = pg < totalPageCount - 1;

        if (check(req, res)) { return };

        prisma.Board.findMany({
            where: { accountId: id },
            skip: pg * pnum,
            take: pnum,
            orderBy: [
                { createdAt: 'desc' }
            ],
            include: {
                account: true,
            },
        }).then(brds => {
            const data = {
                title: 'Boards',
                login: req.session.login,
                accountId: id,
                userName: req.params.user,
                content: brds,
                page: pg,
                hasNextPage: hasNextPage
            };
            res.render('boards/home', data);
        });
    });
});

//編集ページGET
router.get('/edit/:id', (req, res, next) => {

        const messageId = +req.params.id;
        const accountId = req.session.login.id;

    prisma.Board.findUnique({
        where: { id: messageId },
        select: { accountId: true, message: true }
    }).then(board => {
        if (board && board.accountId === accountId) {
            var data = {
                title: 'Board/Edit',
                board: board
            };
            res.render('boards/edit', data)
        } else {
            res.status(403).send('<h1><span style="color: red;">このメッセージを編集する権限がありません。</span></h1>');
        }
    }).catch(error => {
        var data = {
            title: 'Board/Edit',
            content: 'メッセージの取得中にエラーが発生しました。<br>' + error.message
        }
        console.error('Error fetching board:', error);
        res.render('boards/edit', data);
    });
});

// 編集POST
router.post('/edit', (req, res, next) => {
    const { id, msg } = req.body; // フォームから id を受け取る
    prisma.Board.update({
        where: { id: parseInt(id) }, // id を指定して更新
        data: {
            message: msg
        }
    }).then((updatedBoard) => {
        res.redirect('/boards');
    }).catch(error => {
        console.error('Error updating board:', error);
        res.status(500).send('エラーが発生しました');
    });
});

module.exports = router;