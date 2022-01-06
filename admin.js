const hostname = 'localhost';
const username = 'root';
const password = 'password';

var mysql = require('mysql');
var readline = require('readline');
const { Console } = require('console');
const { Transform } = require('stream');
const Pool = require('mysql/lib/Pool');

function table(input) {
  const ts = new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });
  logger.table(input);
  const table = (ts.read() || '').toString();
  let result = '';
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    r = r.replace(/fullname/, '  姓名  ');
    r = r.replace(/customer/, '  住户  ');
    r = r.replace(/sex /, '性别');
    r = r.replace(/personal_id/, '   身份证  ');
    r = r.replace(/phone/, '电话 ');
    r = r.replace(/ id /, '房号');
    r = r.replace(/room_id/, '  房号 ');
    r = r.replace(/r_type/, ' 类型 ');
    r = r.replace(/price/, ' 价格');
    r = r.replace(/checkin /, '入住日期');
    r = r.replace(/checkout/, '退房日期');
    r = r.replace(/null/, '暂无');
    result += `${r}\n`;
  }
  console.log(result);
}

async function selectQuery(sql) {
  let con = mysql.createConnection({
    host: hostname,
    user: username,
    password: password,
    database: 'hotel',
  });
  await con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err, result) {
      if (err) throw err;
      table(result);
      rl.prompt();
    });
    con.end();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.setPrompt(
  '欢迎来到客房管理系统！\n1. 查看住户个人信息\n2. 查看已入住房间信息\n3. 查看未入住房间信息\n4. 退出\n选择> '
);
rl.prompt();
rl.on('line', function (line) {
  if (line === '1') {
    selectQuery('select * from customers');
  } else if (line === '2') {
    selectQuery(
      'select room_id,\
       r_type, price,\
       fullname as customer,\
       DATE_FORMAT(checkin,"%Y-%m-%d") as checkin,\
       DATE_FORMAT(checkout,"%Y-%m-%d") as checkout\
       from orders o\
       inner join rooms r on o.room_id=r.id\
       inner join customers c on o.personal_id=c.personal_id'
    );
  } else if (line === '3') {
    selectQuery(
      'select id, r_type, price\
       from rooms\
       where id not in (\
             select room_id\
             from orders\
             )'
    );
  } else if (line === '4') {
    rl.close();
  } else {
    rl.prompt();
  }
});

rl.on('close', function () {
  console.log('再见！');
  process.exit(0);
});
