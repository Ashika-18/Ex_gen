const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3');

//データオブジェクトの取得
const db = new sqlite3.Database('mydb.db');

//GETアクセスの処理
router.get('/', (req, res, next) => {
    db.serialize(() => {
        var rows = "";
        db.each("select * from mydb", (err, row) => {
            if (!err) {
                rows += "<tr><th>" + row.id + "</th><td>" + row.name + "</td></tr>"
            }
        }, (err, count) => {
            if (!err) {
                var data = {
                    title: 'Hello!',
                    content: rows
                };
                res.render('hello', data);
            }
        });
    });
});
module.exports = router;