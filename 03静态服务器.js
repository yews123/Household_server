//导入express
const express = require('express')
//创建web服务器
const app = express()

//配置解析表单数据的中间件
app.use(express.urlencoded({extended:false}))
//导入路由模块
const router = require('./02apiRouter')
//把路由模块注册到app上
app.use('/api', router)

// //导入mysql模块
// const db = require('./04操作数据库')


//开启服务器
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000')
})