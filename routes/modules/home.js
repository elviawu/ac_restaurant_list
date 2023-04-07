// 引用express和express路由器
const express = require('express')
const router = express.Router()
// 引用Restaurant model
const Restaurant = require('../../models/restaurant')
// 定義首頁路由
router.get('/', (req, res) => {
  Restaurant.find() //取出Restaurant Model中所有資料
    .lean() //把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
    .then(restaurants => res.render('index', { restaurants: restaurants })) //將資料傳給index樣板
    .catch(error => console.log(error)) //錯誤處理
})
// 匯出路由器
module.exports = router