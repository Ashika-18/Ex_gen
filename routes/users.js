var express = require('express');
var router = express.Router();
const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

// PostgreSQLモジュールを追加する
const { Pool } = require('pg');
const session = require('express-session');

var lastCursor = 0;
var cursor = 1;

prisma.$use(async (params, next) => {
  const result = await next(params);
  // cursor = result[result.length - 1].id;
  cursor = result && result.length > 0 ? result[result.length - 1].id : 1;
  if (cursor == lastCursor) {
    cursor = 1;
  }
  lastCursor = cursor;
  return result;
});

router.get('/', (req, res, next) => {
  prisma.user.findMany({
    orderBy: [{id: 'asc'}],
    cursor: { id:cursor },
    take: 3,
  }).then( users=> {
    const data = {
      title: 'Users/Index',
      content: users
    }
    res.render('users/index', data);
  });
});

//like検索
router.get('/find', (req, res, next) => {
  const name = req.query.name;
  prisma.user.findMany({
    where: { 
      OR: [
        { name: { contains: name }},
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

router.post('/add', async (req, res, next) => {
  try {
    //同じ名前のユーザーが存在するかの確認
    const existingUser = await prisma.User.findUnique({
      where: {
        name: req.body.name
      }
    });
     
    if (existingUser) {
      //同じ名前がある時の処理
      const data = {
        message: '同じ名前が存在します。他の名前を入力してください。',
        returnTo: '/users/index'
      };
      console.log(data.returnTo);
      return res.render('error',data);
    };
    
    //新しいユーザーを作成
    const createdUser = await prisma.User.create({
      data: {
        name: req.body.name,
        pass: req.body.pass
      }
    });

    const data = {
      title: 'User/Created',
      content: [createdUser],
      message: `${createdUser.name} が作成されました。`
    };

    res.render('users/index', data);
  } catch (error) {
    const data = {
      message: 'ユーザーの追加中にエラーが発生しました。',
      returnTo: '/users/index'
    }
    return res.render('error', data);
  }
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
  const {id, name, pass } = req.body;
  prisma.User.update({
    where: { id: +id },
    data: {
      name: name,
      pass: pass
    }
  }).then((updateUser) => {
    console.log(updateUser.name + 'を更新しました！🐸');
    res.redirect('/users');
  });
});

//削除delete処理
router.get('/delete/:id', (req, res, next) => {
  const id = req.params.id;
  prisma.user.findUnique(
    { where: { id: +id }}
  ).then(usr => {
    const data = {
      title: 'Users/Delete',
      user: usr
    };
    res.render('users/delete', data);
  });
});

router.post('/delete', (req, res, next) => {
  prisma.User.delete({
    where: { id: +req.body.id}
  }).then(() => {
    res.redirect('/users');
  });
});

//ログイン処理
router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力して下さい'
  }
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
  prisma.User.findMany({
    where: {
      name: req.body.name,
      pass: req.body.pass
    }
  }).then(usr => {
    if (usr != null && usr[0] != null) {
      req.session.login = usr[0];
      let back = req.session.back;
      if (back == null) {
        back = '/';
      }
      res.redirect(back);
    } else {
      var data = {
        title: 'Users/Login',
        content: '<span style="color: red;">名前かパスワードに問題があります！再入力をお願いします。</span>',
        
      }
      res.render('users/login', data);
    }
  })
});

module.exports = router;