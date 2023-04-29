// 引用express和express路由器
const express = require('express')
const router = express.Router()
// 引用Restaurant model 和 sortRestaurants model
const Restaurant = require('../../models/restaurant')
const sortRestaurants = require('../../sortRestaurants')
// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id
  let sort = req.query.sort
  Restaurant.find({userId}) //取出Restaurant Model中所有資料
    .lean() //把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
    .sort(sortRestaurants(sort)) //按條件進行排序
    .then(restaurants => res.render('index', { restaurants: restaurants, sort: sort })) //將資料傳給index樣板
    .catch(error => console.log(error)) //錯誤處理
})
// 匯出路由器
module.exports = router