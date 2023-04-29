// 引用express和express路由器
const express = require('express')
const router = express.Router()
// 引用Restaurant model
const Restaurant = require('../../models/restaurant')
//搜尋餐廳或類別
router.get('/', (req, res) => {
  console.log(req.query.keywords)
  if (!req.query.keywords) {
    res.redirect('/')
  }
  const userId = req.user._id
  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()
  Restaurant.find({userId})
    .lean()
    .then(restaurants => {
      const filterRestaurantsData = restaurants.filter(data => data.name.toLowerCase().includes(keyword) || data.category.toLowerCase().includes(keyword))
      res.render('index', { restaurants: filterRestaurantsData, keywords })
    })
    .catch(error => console.log(error))
})
// 匯出路由器
module.exports = router