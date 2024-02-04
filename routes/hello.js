const express = require('express');
const router = express.Router();

const pg = require('pg');

const connectionString = "postgres://ashika:PSnehSjO2kPoVUC1Jt89qfbdAqeDLyLJ@dpg-cmvlut8l5elc73ef4570-a.singapore-postgres.render.com/mydb_g3ny"

const client = new pg.Client({
  connectionString: connectionString,
});

//indexアクセスの処理
router.get('/', (req, res, next) => {
    db.serialize(() => {
        var rows = "";
        db.each("select * from mydb", (err, row) => {
            if (!err) {
                rows += "<tr><th>" + row.id + "</th><td>" + row.name +"</td><td>" + row.age + "</td></tr>";
            }
        }, (err, count) => {
            if (!err) {
                var data = {
                    title: "Hello",
                    content: rows
                };
                res.render('hello', data);
            }   
        });
    });
});

//addアクセスの処理
const { check, validationResult } = require('express-validator');

router.get('/add', (req, res, next) => {
    var data = {
        title: 'Hello/Add',
        content: '新しいレコードを入力:',
        form: {name:'', mail:'', age:0}
    }
    res.render('hello/add', data);
});

router.post('/add', [
    check('name', 'NAME は必ず入力して下さい！').notEmpty().escape(),
    check('mail', 'MAIL は必ず記入して下さい!').isEmail().escape(),
    check('age', 'AGE は年齢(整数)を入力して下さい!').custom(value => {
        return value >= 0 && value <= 120;
    })
], (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        var result = '<ul class="text-danger">';
        var result_arr = errors.array();
        for (var n in result_arr) {
            result += '<li>' + result_arr[n].msg + '</li>'
        }
        result += '</ul>';
        var data = {
            title: 'Hello/Add',
            content: result,
            form: req.body
        }
        res.render('hello/add', data);
    } else {
        var nm = req.body.name;
        var ml = req.body.mail;
        var ag = req.body.age;
        db.serialize(() => {
            db.run('insert into mydb (name, mail, age) values (?, ?, ?)', nm, ml, ag);
        });
        res.redirect('/hello');
    }
});

//showアクセスの処理
router.get('/show', (req, res, next) => {
    const id = req.query.id;
    db.serialize(() => {
        const q = "select * from mydb where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'Hello/Show',
                    content: 'id = ' + id + 'のレコード:',
                    mydata: row
                }
                res.render('hello/show', data);
            }
        });
    });
});

//editアクセスの処理
router.get('/edit', (req, res, next) => {
    const id = req.query.id;
    db.serialize(() => {
        const q = "select * from mydb where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'hello/edit',
                    content: 'id =' + id + 'のレコードを編集',
                    mydata: row
                }
                res.render('hello/edit', data);
            }
        });
    });
});

router.post('/edit', (req, res, next) => {
    const id = req.body.id;
    const nm = req.body.name;
    const ml = req.body.mail;
    const ag = req.body.age;
    const q = "update mydb set name = ?, mail = ?, age = ? where id = ?";
    db.serialize(() => {
        db.run(q, nm, ml, ag, id);
    });
    res.redirect('/hello');
});

//delete処理
router.get('/delete', (req, res, next) => {
    const id = req.query.id;
    db.serialize(() => {
        const q = "select * from mydb where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'Hello/Delete',
                    content: 'id = ' + id + 'のレコードを削除します:',
                    mydata: row
                }
                res.render('hello/delete', data);
            }
        });
    });
});

router.post('/delete', (req, res, next) => {
    const id = req.body.id;
    db.serialize(() => {
        const q = "delete from mydb where id = ?";
        db.run(q, id);
    });
    res.redirect('/hello');
});

//find処理
router.get('/find', (req, res, next) => {
    db.serialize(() => {
        db.all("select * from mydb", (err, rows) => {
            if (!err) {
                var data = {
                    title: 'Hello/Find/検索前',
                    find: '',
                    content: '検索条件を入力して下さい。',
                    mydata: rows
                };
                res.render('hello/find', data);
            }
        });
    });
});

router.post('/find', (req, res, next) => {
    var find = req.body.find;
    db.serialize(() => {
        var q = "select * from mydb where ";
        db.all(q + find, [], (err, rows) => {
            if (!err) {
                var data = {
                    title: 'Hello/Find/検索後',
                    find: find,
                    content: '検索条件' + find,
                    mydata: rows
                }
                res.render('hello/find', data);
            }
        });
    });
});

module.exports = router;