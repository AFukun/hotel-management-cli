drop database if exists hotel;
create database hotel;
use hotel;

create table rooms (
    id char(3),
    r_type char(2) check (r_type = '单' or r_type = '双'),
    price decimal(5 , 2 ),
    primary key (id)
);

create table customers (
    fullname varchar(8) not null,
    sex char(2) default '男' check (sex = '男' or sex = '女'),
    personal_id char(18) not null,
    phone char(11),
    primary key (personal_id)
);

create table orders (
    personal_id char(18) not null,
    room_id char(3) not null,
    checkin date,
    checkout date,
    foreign key (personal_id)
        references customers (personal_id),
    foreign key (room_id)
        references rooms (id)
);

insert into rooms values
('201','单','99.90'),
('202','单','199.90'),
('203','双','299.90'),
('301','单','99.90'),
('302','单','199.90'),
('303','双','299.90');

insert into customers values
('张三','男','111111111111111111','00000000000'),
('李四','女','222222222222222222','00000000000'),
('王五','男','333333333333333333','00000000000'),
('王六','男','444444444444444444','00000000000');

insert into orders values
('111111111111111111','201','2022-1-1','2022-1-2'),
('333333333333333333','203','2022-2-1',null),
('444444444444444444','203','2022-2-1',null),
('222222222222222222','302','2022-1-2','2022-1-4');
