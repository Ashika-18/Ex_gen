var express = require('express');
var router = express.Router();
const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

router.get('/', (req, res, next) => {
  const id = +req.query.id;
  if (!id) {
    prisma.user.findMany().then( users => {
      const data = {
        title: 'Users/Index',
        content: users
      }
      res.render('users/index', data);
    });
  } else {
    prisma.user.findMany({
      where: { id: {gt: id} }
    }).then(usrs => {
      var data = {
        title: 'Users/Index',
        content: [usrs]
      }
      res.render('users/index', data);
    });
  }
});

//like検索
router.get('/find', (req, res, next) => {
  const name = req.query.name;
  const mail = req.query.mail;
  prisma.user.findMany({
    where: { 
      OR: [
        { name: { contains: name }},
        { mail: { contains: mail }}
      ]
    }
  }).then(usrs => {
    var data = {
      title: 'Users/Find',
      content: usrs
    }
    res.render('users/index', data);
  });
});

//addの処理
router.get('/add', (req, res, next) => {
  const data = {
    title: 'Users/Add'
  }
  res.render('users/add', data);
});

router.post('/add', (req, res, next) => {
  prisma.User.create({
    data:{
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: +req.body.age
    }
  })
  .then((createdUser) => {
    console.log(createdUser.name + "が作成されました!🐉");
    res.redirect('/users');
  });
});

//更新の処理edit
router.get('/edit/:id', (req, res, next) => {
  const id = req.params.id;
  prisma.user.findUnique(
    { where: { id: +id}}
    ).then(usr => {
      const data = {
        title: 'User/Edit',
        user: usr
      };
      res.render('users/edit', data);
    });
});

router.post('/edit', (req, res, next) => {
  const {id, name, pass, mail, age } = req.body;
  prisma.user.update({
    where: { id: +id },
    data: {
      name: name,
      mail: mail,
      pass: pass,
      age: +age
    }
  }).then((updateUser) => {
    console.log(updateUser.name + 'を更新しました！🐸');
    res.redirect('/users');
  });
});

module.exports = router;