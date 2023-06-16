//导入mysql模块
const mysql = require('mysql')
//与数据库建立连接(数据库连接池)
const db = mysql.createPool({
    host: '127.0.0.1',//数据库的IP地址
    user: 'root',//登录数据库的账号
    password: '111111',//登录数据库的密码
    database:'my_db_01'//指定要操作的数据库
})


//测试mysql模块能否正常工作
// db.query('select 1', (err, results) => {
//     //mysql模块工作期间报错了
//     if (err) return console.log(err.message)
//     //能够成功的执行sql语句
//     console.log(results)
// })


//查询users表中所有的数据
// const sqlStr = 'select * from users'
// db.query(sqlStr, (err, results) => {
//     //查询数据失败
//     if (err) return console.log(err.message)
//     //能够成功的执行sql语句
//     //注意：如果执行的是select查询语句，则执行的结果是数组
//     console.log(results)
// })

//要插入到users表中的数据对象
const user = { username: 'zhaosi', password: '124563' }
//待执行的sql语句，其中英文的?表示占位符
const sqlStr='insert into users (username,password) values (?,?)'
db.query(sqlStr,[user.username,user.password],(err, results) => {
    
    if (err) return console.log(err.message)//失败
    //能够成功的执行sql语句
    if (results.affectedRows === 1) {
        console.log('插入数据成功')//成功
    }
})

//插入数据的便捷方式
//要插入到users表中的数据对象
// const user = { username: 'zhs', password: '12456' }
// //待执行的sql语句，其中英文的?表示占位符
// const sqlStr = 'insert into users set ?'
// //直接将数据对象user当作占位符的值
// db.query(sqlStr,user,(err, results) => {
    
//     if (err) return console.log(err.message)//失败
//     //能够成功的执行sql语句
//     if (results.affectedRows === 1) {
//         console.log('插入数据成功')//成功
//     }
// })

//更新数据
//要更新的数据对象
/* const user = { id:6,username: 'zi', password: '666666' }
//待执行的sql语句，其中英文的?表示占位符
const sqlStr = 'update users set username=?,password=? where id=?'
//调用db.query()执行sql语句的同时，使用数组依次为占位符指定具体的值
db.query(sqlStr,[user.username,user.password,user.id],(err, results) => {
    
    if (err) return console.log(err.message)//失败
    
    if (results.affectedRows === 1) {
        console.log('更新数据成功')//成功
    }
}) */


//更新数据的便捷方式
// const user = { id:6,username: 'z', password: '666666' }
// //待执行的sql语句，其中英文的?表示占位符
// const sqlStr = 'update users set ? where id=?'
// //调用db.query()执行sql语句的同时，使用数组依次为占位符指定具体的值
// db.query(sqlStr,[user,user.id],(err, results) => {
    
//     if (err) return console.log(err.message)//失败
    
//     if (results.affectedRows === 1) {
//         console.log('更新数据成功')//成功
//     }
// })


//删除数据
//待执行的sql语句，其中英文的?表示占位符
// const sqlStr = 'delete from users where id=?'
// //调用db.query()执行sql语句的同时，使用数组依次为占位符指定具体的值
// db.query(sqlStr,7,(err, results) => {
    
//     if (err) return console.log(err.message)//失败
    
//     if (results.affectedRows === 1) {
//         console.log('删除数据成功')//成功
//     }
// })

//标记删除
//待执行的sql语句，其中英文的?表示占位符
// const sqlStr = 'update users set status=? where id=?'
// //调用db.query()执行sql语句的同时，使用数组依次为占位符指定具体的值
// db.query(sqlStr,[1,7],(err, results) => {
    
//     if (err) return console.log(err.message)//失败
    
//     if (results.affectedRows === 1) {
//         console.log('标记删除成功')//成功
//     }
// })
module.exports=db