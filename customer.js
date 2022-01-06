const hostname = 'localhost';
const username = 'root';
const password = 'password';

var mysql = require('mysql');
var readline = require('readline');

function bookRoom(orderList) {
  let con = mysql.createConnection({
    host: hostname,
    user: username,
    password: password,
    database: 'hotel',
  });
  con.connect(function (err) {
    if (err) throw err;
    var sql, order;
    for (let i = 0; i < orderList.length; i++) {
      order = orderList[i];
      sql =
        'INSERT INTO customers VALUES ("' +
        order.fullname +
        '","' +
        order.sex +
        '","' +
        order.id +
        '","' +
        order.phone +
        '");';
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
      sql =
        'INSERT INTO orders VALUES ("' +
        order.id +
        '","' +
        order.room +
        '","' +
        order.checkin +
        '","' +
        order.checkout +
        '");';
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
    }
    console.log('预定成功！按Enter继续');
    con.end();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
var orderList;
rl.setPrompt('欢迎来到客房预定系统！\n1. 单人预定\n2. 团体预定\n3. 退出\n选择> ');
rl.prompt();
rl.on('line', function (line) {
  if (line === '1') {
    orderList = [];
    rl.question('请输入您的姓名：', function (fullname) {
      rl.question('请输入您的性别：', function (sex) {
        rl.question('请输入您的身份证：', function (id) {
          rl.question('请输入您的电话：', function (phone) {
            rl.question('请输入您希望预定的房间：', function (room) {
              rl.question('请输入您的入住时间：', function (checkin) {
                rl.question('请输入您的退房时间：', function (checkout) {
                  orderList.push({
                    fullname: fullname,
                    sex: sex,
                    id: id,
                    phone: phone,
                    room: room,
                    checkin: checkin,
                    checkout: checkout,
                  });
                  bookRoom(orderList);
                });
              });
            });
          });
        });
      });
    });
  }
  if (line === '2') {
    orderList = [];
    rl.question('请输入团员数量：', function (memberCount) {
      function quest(i, memberCount) {
        rl.question(`请输入团员${i}的姓名：`, function (fullname) {
          rl.question(`请输入团员${i}的性别：`, function (sex) {
            rl.question(`请输入团员${i}的身份证：`, function (id) {
              rl.question(`请输入团员${i}的电话：`, function (phone) {
                rl.question(`请输入团员${i}希望预定的房间：`, function (room) {
                  rl.question(`请输入团员${i}的入住时间：`, function (checkin) {
                    rl.question(`请输入团员${i}的退房时间：`, function (checkout) {
                      orderList.push({
                        fullname: fullname,
                        sex: sex,
                        id: id,
                        phone: phone,
                        room: room,
                        checkin: checkin,
                        checkout: checkout,
                      });
                      if (i == memberCount) {
                        bookRoom(orderList);
                      } else {
                        quest(i + 1, memberCount);
                      }
                    });
                  });
                });
              });
            });
          });
        });
      }
      quest(1, memberCount);
    });
  }
  if (line === '3') {
    rl.close();
  }
  rl.prompt();
});

rl.on('close', function () {
  console.log('再见！');
  process.exit(0);
});
