const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

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
        var data = {
            title: 'Boards',
            login: req.session.login,
            content: brds,
            page: pg
        }
        res.render('boards/index', data);
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
    if (check (req, res)) { return };
    const id = +req.params.id;
    const pg = +req.params.page;
    prisma.Board.findMany({
        where: { accountId: id },
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            {createdAt: 'desc'}
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
            page: pg
        }
        res.render('boards/home', data);
    });
});

// メッセージ削除の追加
router.post('/delete/:id', (req, res, next) => {
    if (check(req, res)) { return };
    const messageId = +req.params.id;
    const accountId = req.session.login.id;

    // メッセージの所有者の確認
    prisma.Board.findUnique({
        where: { id: messageId },
        select: { accountId: true }
    }).then(board => {
        if (board && board.accountId === accountId) {
            prisma.Board.delete({
                where: { id: messageId }
            }).then(() => {
                res.redirect('/boards');
            }).catch(error => {
                var data = {
                    title: 'User/Delete',
                    content: '削除中にエラーが発生しました。<br>' + error.message
                }
                res.render('/delete', data);
            });
        } else {
            res.status(403).send('このメッセージを削除する権限がありません。');
        }
    }).catch(error => {
        var data = {
            title: 'User/Delete',
            content: 'メッセージの取得中にエラーが発生しました。<br>' + error.message
        }
        res.render('/delete', data);
    });
});

module.exports = router;