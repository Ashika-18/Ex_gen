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

module.exports = router;