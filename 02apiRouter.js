const express = require('express')
const dayjs=require('dayjs')
const bodyParser = require('body-parser')
const router = express.Router()
//导入mysql模块
const mysql = require('mysql')
//与数据库建立连接(数据库连接池)
const pool = mysql.createPool({
    host: '127.0.0.1',//数据库的IP地址
    user: 'root',//登录数据库的账号
    password: '111111',//登录数据库的密码
    database: 'my_db_01',//指定要操作的数据库
    multipleStatements: true //可以执行多条sql语句
})
//创建application/json解析
var jsonParser = bodyParser.json()
//创建application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//挂载路由(产品数据接口)
router.get('/product', (req, res) => {
    //通过req.query获取客户端通过查询字符串，发送到服务器数据
    const query = req.query
    const sqlStr = 'select * from product'
    pool.query(sqlStr,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        console.log(results)
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        res.send({
            code: 200,
            msg: 'info',
            data:data
        })
    })
   
})


//获取验证码接口
router.get('/code/:phone', (req, res) => {
    const params = req.params
    if (params) {
       //生成6位数验证码函数
        var codes = ''
        for (var i = 1; i <= 6; i++){
            const num = Math.floor(Math.random() * 10)
            codes += num;
        }
    }
    res.send({
        code: 200,
        msg: 'get 请求成功！',
        data:codes
    })
})
//注册接口
router.post('/register',jsonParser, (req, res) => {
    //通过req.body获取请求体中包含的url-encoded格式数据
    const body = req.body
    
  
    const sqlStr = 'insert into users (phone,password) values (?,?)'
    pool.query(sqlStr,[body.phone,body.password],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        //能够成功的执行sql语句
        if (results.affectedRows === 1) {
            console.log('插入数据成功')//成功
        }
    })
    res.send({
        code: 200,
        msg: '请求成功',
        data:body
    })
})
//登录接口
router.post('/login',jsonParser, (req, res) => {
    const body = req.body
    const sqlStr = 'select * from users where phone=? and password=?'
    pool.query(sqlStr,[body.phone,body.password],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        if (results.length>0) {
            //生成6位数token值函数
         var codes = ''
         for (var i = 1; i <= 6; i++){
             const num = Math.floor(Math.random() * 10)
             codes += num;
         }
        body.token=codes
        res.send({
            code: 200,
            msg: '登录成功',
            data:body
        })
        } else {
            res.send({
                code: 201,
                msg:'登录失败'
            })
        }
    })
    
})
//获取用户信息接口
router.get('/getUserInfo/:phone', (req, res) => {
    const phone = req.params.phone
    
    if (phone) {
        const sqlStr = 'select * from users where phone=?'
    pool.query(sqlStr,phone,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
       
        
        var data1 = data[0].phone
        
        res.send({
            code: 200,
            msg: 'info',
            data:data1
        })
    })
    }
    
})
//退出登录接口
router.get('/logout', (req, res) => {
    res.send({
        code: 200,
        msg: 'logout',
        data:null
    })
})


//搜索模块数据
//获取商品模块(goodsList接口)
router.post('/goodsList', jsonParser, (req, res) => {
    const body = req.body
    console.log(body)
    //分页需要的参数
    const pageNo = body.pageNo
    //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = body.pageSize
    const start = (pageNo - 1) * pageSize
    if (body.trademark != '') {
        const sqlStr = 'select * from goodsList where keyword=? limit ?,?'
        pool.query(sqlStr,[body.trademark,parseInt(start),parseInt(pageSize)],(err, results) => {
            
            if (err) return console.log(err.message)//失败
            
            var dataString = JSON.stringify(results);
            var data = JSON.parse(dataString)
            var total = data.length
            console.log(total)
            // body.trademark = ''
            // console.log('two',body)
            res.send({
                code: 200,
                msg: 'goodsList',
                total:total,
                data:data
           })
        })
       
    } else {
        if (body.category1Id == '' && body.keyword == '') {
            const sqlStr = 'select count(*) from goodsList;select * from goodsList limit ?,?'//分页器
            pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
            
                if (err) return console.log(err.message)//失败
                
                var dataString = JSON.stringify(results);
                var data = JSON.parse(dataString)
                console.log(data)
                // var total = data.length
                // console.log(total)
                res.send({
                    code: 200,
                    msg: 'goodsList',
                    total:data[0][0]['count(*)'],
                    data:data[1]
               })
            })
        }
        if (body.category1Id == '' && body.keyword != '') {
            const sqlStr = 'select * from goodsList where keyword=? limit ?,?'//分页器
            pool.query(sqlStr,[body.keyword,parseInt(start),parseInt(pageSize)],(err, results) => {
            
                if (err) return console.log(err.message)//失败
                
                var dataString = JSON.stringify(results);
                var data = JSON.parse(dataString)
                var total = data.length
                console.log(total)
                res.send({
                    code: 200,
                    msg: 'goodsList',
                    total:total,
                    data:data
               })
            })
        }
        if (body.category1Id != '' && body.keyword != '') {
            const sqlStr = 'select * from goodsList where productId=? and keyword=? limit ?,?'//分页器
            pool.query(sqlStr,[body.category1Id,body.keyword,parseInt(start),parseInt(pageSize)],(err, results) => {
            
                if (err) return console.log(err.message)//失败
                
                var dataString = JSON.stringify(results);
                var data = JSON.parse(dataString)
                var total = data.length
                console.log(total)
                res.send({
                    code: 200,
                    msg: 'goodsList',
                    total:total,
                    data:data
               })
            })
        }
        if (body.category1Id != '' && body.keyword == '') {
            const sqlStr = 'select * from goodsList where productId=? limit ?,?'//分页器
            pool.query(sqlStr,[body.category1Id,parseInt(start),parseInt(pageSize)],(err, results) => {
            
                if (err) return console.log(err.message)//失败
                
                var dataString = JSON.stringify(results);
                var data = JSON.parse(dataString)
                var total = data.length
                console.log(total)
                res.send({
                    code: 200,
                    msg: 'goodsList',
                    total:total,
                    data: data
                    
               })
            })
        }
    }
})
//trademarkList接口
router.post('/trademarkList', jsonParser, (req, res) => {
    const body=req.body
    if (body.category1Id == '' && body.keyword == '') {
        const sqlStr = 'select * from trademarkList'
        pool.query(sqlStr,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        
        res.send({
            code: 200,
            msg: 'trademarkList',
            data:data
       })
    })
    }
    if (body.category1Id == '' && body.keyword != '') {
        const sqlStr = 'select * from trademarkList where tmName=?'
        pool.query(sqlStr,body.keyword,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        
        res.send({
            code: 200,
            msg: 'trademarkList',
            data:data
       })
    })
    }
    if (body.category1Id != '' && body.keyword != '') {
        const sqlStr = 'select * from trademarkList where productId=? and tmName=?'
        pool.query(sqlStr,[body.category1Id,body.keyword],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        
        res.send({
            code: 200,
            msg: 'trademarkList',
            data:data
       })
    })
    }
    if (body.category1Id != '' && body.keyword == '') {
        const sqlStr = 'select * from trademarkList where productId=?'
        pool.query(sqlStr,[body.category1Id],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        
        res.send({
            code: 200,
            msg: 'trademarkList',
            data:data
       })
    })
    }
})
//pagination接口
router.get('/pagination', (req, res) => {
    const sqlStr = 'select * from goodsList'
    pool.query(sqlStr,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        var len= results.length
        console.log('pagination',len)
        res.send({
            code: 200,
            msg: 'pagination',
            data:len
       })
    })
})


//detail模块
//skuInfo接口
router.get('/skuInfo/:skuId', (req, res) => {

    const sqlStr = 'select * from goodsList where id=?'
    pool.query(sqlStr,req.params.skuId,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        
        
        res.send({
            code: 200,
            msg: 'skuInfo',
            data:data
       })
    })
})
//skuImageList接口
router.get('/skuImageList/:skuId', (req, res) => {

    const sqlStr = 'select * from skuimagelist where goodslistId=?'
    pool.query(sqlStr,req.params.skuId,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        
        
        res.send({
            code: 200,
            msg: 'skuInfo',
            data:data
       })
    })
})
//addOrUpdateShopCart接口(购物车模块也用到这个)
router.post('/addOrUpdateShopCart/:skuId/:skuNum', (req, res) => {
    const sqlStr = 'update goodsList set skuNum=? where id=?'
    pool.query(sqlStr,[req.params.skuNum,req.params.skuId],(err, results) => {
    
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg: 'addToCart',
           })
        }
    })  
})


// 购物车模块
//cartList接口
router.get('/cartList', (req, res) => {
    const sqlStr = 'select * from goodsList where skuNum>0'
    pool.query(sqlStr,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        // console.log('cartList',data)
        
        res.send({
            code: 200,
            msg: '成功',
            data:data
       })
    })
})
//修改某一个商品中选中的状态
router.get('/checkCart/:skuId/:isChecked', (req, res) => {
    console.log('req.params.isChecked', req.params.isChecked)
    console.log('req.params.skuId', req.params.skuId)
    const sqlStr = 'update goodsList set isChecked=? where id=?'
    pool.query(sqlStr,[req.params.isChecked,req.params.skuId],(err, results) => {
        if (err) return console.log(err.message)//失败
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg: 'update',
           })
        }
    })
})
//删除购物产品的接口
router.post('/deleteCart/:skuId', (req, res) => {
    const sqlStr = 'update goodsList set skuNum=0 where id=?'
    pool.query(sqlStr,[req.params.skuId],(err, results) => {
        if (err) return console.log(err.message)//失败
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg: 'delete',
           })
        }
    })
})



//获取用户地址信息
router.get('/userAddress', (req, res) => {
    const sqlStr = 'select * from address'
    pool.query(sqlStr,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        // console.log('address',data)
        
        res.send({
            code: 200,
            msg: '成功',
            data:data
       })
    })
})

//获取商品清单
router.get('/order', (req, res) => {
    const sqlStr = 'select * from goodsList where isChecked=1 and skuNum>0'
    pool.query(sqlStr,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log('isOrder',data)
        
        res.send({
            code: 200,
            msg: '成功',
            data:data
       })
    })
})

//提交订单
router.post('/submitOrder', jsonParser, (req, res) => {
    if (true) {
        //订单编号
         var tradeNo = ''
         for (var i = 1; i <= 6; i++){
             const num = Math.floor(Math.random() * 10)
             tradeNo += num;
         } 
    }
    const time = Date.now()//时间戳
    const createTime=dayjs(time).format('YYYY-MM-DD HH:mm:ss');//订单的生成时间
    const body=req.body
    console.log('sub',body)
    const orderDetailList=body.orderDetailList[0]
    const order = {
        consignee: body.consignee,
        consigneeTel: body.consigneeTel,
        deliveryAddress: body.deliveryAddress,
        status: body.status,
        orderComment:body.orderComment,
        totalNum: body.totalNum,
        totalPrice: body.totalPrice,
        title: orderDetailList.title,
        defaultImg: orderDetailList.defaultImg,
        tradeNo: tradeNo,
        createTime:createTime
    }
    //待执行的sql语句，其中英文的?表示占位符
    const sqlStr = 'insert into orders set ?'
    //直接将数据对象user当作占位符的值
    pool.query(sqlStr,order,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        //能够成功的执行sql语句
        if (results.affectedRows === 1) {
        console.log('插入数据成功')//成功
        }
    })
    res.send({
        code: 200,
        msg: 'get 请求成功！',
        data: tradeNo
    })
})

//获取个人中心数据
router.get('/myorder/:page/:limit',(req, res) => {
   
    //接受用户通过按钮传过来的参数
    const page = req.params.page
    console.log('page', page)
    //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.params.limit
    console.log('limit',typeof(pageSize))
    const start = (page - 1) * pageSize
    console.log('start',typeof(start))
    // const params=[start,pageSize]
    const sqlStr = 'select count(*) from orders; select * from orders order by id desc limit ?,?'
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log('myorder', data)
        var total = data[0][0]['count(*)'];
        console.log(total)
        console.log(data[1][0].createTime)

        //这个函数的作用将时间格式为2023-02-19T01:29:46.000Z转化为2023-02-19 09:29:46
        function timeTrans(time){
            let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000)
            date = date.toJSON();
            date = date.substring(0, 19).replace('T', ' ')
            return date
        }
        data[1].forEach(item => {
            item.createTime = timeTrans(item.createTime)
            console.log(item.createTime)
        });
        res.send({
            code: 200,
            msg: '成功',
            total:total,
            data:data[1]
       })
    })
})






//后台接口



//获取用户信息
router.post('/ht/getUserInfo', jsonParser, (req, res) => {
    console.log(req.body)
    const page = req.body.page
     //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.body.limit
    const start = (page - 1) * pageSize
    if (req.body.phone === '') {
        var sqlStr = 'select count(*) from users; select * from users order by id desc limit ?,?'
    } else {
        var sqlStr = `select count(*) from users where phone=${req.body.phone}; select * from users where phone=${req.body.phone} order by id desc limit ?,?`
    }
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("后台",data)
        var total = data[0][0]['count(*)'];
        
        
        res.send({
            code: 200,
            msg: 'info',
            total:total,
            data:data[1]
        })
    })
})
//增加用户
router.post("/ht/addUser", jsonParser, (req, res) => {
    const body = req.body
    const user = {
        phone: body.phone,
        password: body.password,
        status:body.status
    }
    const sqlStr = 'insert into users set ?'
    pool.query(sqlStr,user,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        //能够成功的执行sql语句
        if (results.affectedRows === 1) {
        console.log('插入数据成功')//成功
        }
    })
})

//删除用户
router.post("/ht/deleteUser", jsonParser, (req, res) => {
    const body = req.body
    const phone=body.phone
    const sqlStr = 'delete from  users where phone=?'
    pool.query(sqlStr,phone,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        //能够成功的执行sql语句
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg:'删除数据成功'
            })
        }
       
    })
})

//搜索用户
router.post("/ht/searchUser", jsonParser, (req, res) => {
    const body = req.body
    const phone=body.phone
    const sqlStr = 'select * from  users where phone=?'
    pool.query(sqlStr,phone,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("搜索",data)
        res.send({
            code: 200,
            msg: '搜索数据成功',
            data:data
        })
    })
})

//获取品牌信息
router.post('/ht/trademarkInfo', jsonParser, (req, res) => {
    console.log(req.body)
    const page = req.body.page
     //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.body.limit
    const start = (page - 1) * pageSize
    if (req.body.tmName === '') {
        var sqlStr = 'select count(*) from trademarkList; select * from trademarkList order by tmId desc limit ?,?'
    } else {
        var sqlStr = `select count(*) from trademarkList where tmName='${req.body.tmName}'; select * from trademarkList where tmName='${req.body.tmName}' order by tmId desc limit ?,?`
    }
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("品牌",data)
        var total = data[0][0]['count(*)'];
        
        
        res.send({
            code: 200,
            msg: 'info',
            total:total,
            data:data[1]
        })
    })
})

//增加品牌
router.post("/ht/addTrademark", jsonParser, (req, res) => {
    const body = req.body
    const user = {
        tmId: body.tmId,
        tmName: body.tmName,
        productId:body.productId
    }
    const sqlStr = 'insert into trademarkList set ?'
    pool.query(sqlStr,user,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        //能够成功的执行sql语句
        if (results.affectedRows === 1) {
        console.log('插入数据成功')//成功
        }
    })
})

//删除品牌
router.post("/ht/deleteTrademark", jsonParser, (req, res) => {
    const body = req.body
    const tmId=body.tmId
    const sqlStr = 'delete from  trademarkList where tmId=?'
    pool.query(sqlStr,tmId,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        //能够成功的执行sql语句
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg:'删除数据成功'
            })
        }
       
    })
})

//获取商品信息
router.post('/ht/goodsInfo', jsonParser, (req, res) => {
    console.log(req.body)
    const page = req.body.page
     //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.body.limit
    const start = (page - 1) * pageSize
    if (req.body.keyword === '') {
        var sqlStr = 'select count(*) from goodsList; select * from goodsList limit ?,?'
    } else {
        var sqlStr = `select count(*) from goodsList where keyword='${req.body.keyword}'; select * from goodsList where keyword='${req.body.keyword}'limit ?,?`
    }
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("品牌",data)
        var total = data[0][0]['count(*)'];
        
        
        res.send({
            code: 200,
            msg: 'info',
            total:total,
            data:data[1]
        })
    })
})


//获取已支付的订单信息
router.post('/ht/orderInfo', jsonParser, (req, res) => {
    console.log(req.body)
    const page = req.body.page
     //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.body.limit
    const start = (page - 1) * pageSize
    if (req.body.tradeNo === '') {
        var sqlStr = 'select count(*) from orders where status="已支付"; select * from orders where status="已支付" order by id desc limit ?,?'
    } else {
        var sqlStr = `select count(*) from orders where tradeNo=${req.body.tradeNo}; select * from orders where tradeNo=${req.body.tradeNo} and status="已支付" order by id desc`
    }
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("订单",data)
        var total = data[0][0]['count(*)'];
        
        
        res.send({
            code: 200,
            msg: 'info',
            total:total,
            data:data[1]
        })
    })
})

//发货
router.post('/ht/delivery', jsonParser, (req, res) => {
    console.log(req.body)
    const sqlStr='update orders set status="已发货" where id=?'
    pool.query(sqlStr,req.body.id,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg:'发货成功'
            })
        }
    })
    
})

//获取已发货的订单信息
router.post('/ht/deliveryInfo', jsonParser, (req, res) => {
    console.log(req.body)
    const page = req.body.page
     //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.body.limit
    const start = (page - 1) * pageSize
    if (req.body.tradeNo === '') {
        var sqlStr = 'select count(*) from orders where status="已发货"; select * from orders where status="已发货" order by id desc limit ?,?'
    } else {
        var sqlStr = `select count(*) from orders where tradeNo=${req.body.tradeNo}; select * from orders where tradeNo=${req.body.tradeNo} and status="已发货" order by id desc`
    }
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("订单",data)
        var total = data[0][0]['count(*)'];
        
        
        res.send({
            code: 200,
            msg: 'info',
            total:total,
            data:data[1]
        })
    })
})

//用户已收货
router.post('/ht/receiver', jsonParser, (req, res) => {
    console.log(req.body)
    const sqlStr='update orders set status="已收货" where id=?'
    pool.query(sqlStr,req.body.id,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg:'发货成功'
            })
        }
    })
    
})

//获取已收货的订单信息
router.post('/ht/receiverInfo', jsonParser, (req, res) => {
    console.log(req.body)
    const page = req.body.page
     //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.body.limit
    const start = (page - 1) * pageSize
    if (req.body.tradeNo === '') {
        var sqlStr = 'select count(*) from orders where status="已收货"; select * from orders where status="已收货" order by id desc limit ?,?'
    } else {
        var sqlStr = `select count(*) from orders where tradeNo=${req.body.tradeNo}; select * from orders where tradeNo=${req.body.tradeNo} and status="已收货" order by id desc`
    }
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("订单",data)
        var total = data[0][0]['count(*)'];
        
        
        res.send({
            code: 200,
            msg: 'info',
            total:total,
            data:data[1]
        })
    })
})

//已完成
router.post('/ht/finish', jsonParser, (req, res) => {
    console.log(req.body)
    const sqlStr='update orders set status="已完成" where id=?'
    pool.query(sqlStr,req.body.id,(err, results) => {
    
        if (err) return console.log(err.message)//失败
        
        if (results.affectedRows === 1) {
            res.send({
                code: 200,
                msg:'已完成'
            })
        }
    })
    
})

//获取已完成的订单信息
router.post('/ht/finishInfo', jsonParser, (req, res) => {
    console.log(req.body)
    const page = req.body.page
     //需要对pageSize进行转型，传过来的参数默认是string
    const pageSize = req.body.limit
    const start = (page - 1) * pageSize
    if (req.body.tradeNo === '') {
        var sqlStr = 'select count(*) from orders where status="已完成"; select * from orders where status="已完成" order by id desc limit ?,?'
    } else {
        var sqlStr = `select count(*) from orders where tradeNo=${req.body.tradeNo}; select * from orders where tradeNo=${req.body.tradeNo} and status="已完成" order by id desc`
    }
    pool.query(sqlStr,[parseInt(start),parseInt(pageSize)],(err, results) => {
    
        if (err) return console.log(err.message)//失败
        var dataString = JSON.stringify(results);
        var data = JSON.parse(dataString)
        console.log("订单",data)
        var total = data[0][0]['count(*)'];
        
        
        res.send({
            code: 200,
            msg: 'info',
            total:total,
            data:data[1]
        })
    })
})


module.exports=router