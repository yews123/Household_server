//导入express
const express = require('express')
//创建web服务器
const app = express()
//路由挂载
app.get('/', (req, res) => {
    res.send('get request')
})
app.post('/', (req, res) => {
    res.send('post request')
})
app.listen(8081, () => {
    console.log('http://127.0.0.1:8081')
})