drop database if exists hotel;
create database hotel;
use hotel;

CREATE TABLE rooms (
    id CHAR(3),
    r_type CHAR(2) CHECK (r_type = '单' OR r_type = '双'),
    price DECIMAL(5 , 2 ),
    PRIMARY KEY (id)
);

CREATE TABLE customers (
    fullname VARCHAR(8) NOT NULL,
    personal_id CHAR(18) NOT NULL,
    sex CHAR(2) DEFAULT '男' CHECK (sex = '男' OR sex = '女'),
    phone CHAR(11),
    PRIMARY KEY (fullname)
);

CREATE TABLE orders (
    c_name VARCHAR(16) NOT NULL,
    room_id CHAR(3) NOT NULL,
    FOREIGN KEY (c_name)
        REFERENCES customers (fullname),
    FOREIGN KEY (room_id)
        REFERENCES rooms (id)
);

insert into rooms values
('201','单','99.90'),
('202','单','199.90'),
('203','双','299.90'),
('301','单','99.90'),
('302','单','199.90'),
('303','双','299.90');

insert into customers values
('张三','111111111111111111','男','00000000000'),
('李四','222222222222222222','女','00000000000'),
('王五','333333333333333333','男','00000000000'),
('王六','444444444444444444','男','00000000000');

insert into orders values
('张三','201'),
('王五','203'),
('王六','203'),
('李四','302');
