var express = require('express');
var router = express.Router();
const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

router.get('/', (req, res, next) => {
  prisma.user.findMany().then(users => {
    const data = {
      title: 'Users/Index',
      content: users
    }
    res.render('users/index', data);
  });
});

module.exports = router;
