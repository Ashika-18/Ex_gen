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
        content: usrs
      }
      res.render('users/index', data);
    });
  }
});

//like検索
router.get('/find', (req, res, next) => {
  const name = req.query.name;
  prisma.user.findMany({
    where: {name: {contains: name} }
  }).then(usrs => {
    var data = {
      title: 'Users/Find',
      content: usrs
    }
    res.render('users/index', data);
  });
});

module.exports = router;
