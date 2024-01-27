var express = require('express');
var router = express.Router();
const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('これはuser画面です');
});

module.exports = router;
