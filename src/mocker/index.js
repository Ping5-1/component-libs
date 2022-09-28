const delay = require('mocker-api/lib/delay');
const { login } = require('./user');

// 是否禁用MOCK代理
const noProxy = process.env.VUE_APP_NO_PROXY === 'true';

const proxy = {
  'POST /api/userinfo/:id': (req, res) => {
    console.log('-1--->', req.params);
    return res.json({
      id: '111',
      username: 'kenny',
      sex: 6
    });
  },
  'POST /api/login/account': login,
  'DELETE /api/user/:id': (req, res) => {
    console.log('--2-->', req.body);
    console.log('--3-->', req.params.id);
    res.send({ status: 'ok', message: '删除成功！' });
  }
};
module.exports = noProxy ? {} : delay(proxy, 1000);
