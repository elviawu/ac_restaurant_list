// 引用express和express路由器
const express = require('express')
const router = express.Router()
// 引用Restaurant model
const Restaurant = require('../../models/restaurant')
// 新增一筆資料
router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', (req, res) => {
  const userId = req.user._id
  const restaurant = req.body
  Restaurant.create({ ...restaurant, userId })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})
// 瀏覽資料細節
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})
// 修改一筆資料
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const restaurant = req.body
  Restaurant.findOneAndUpdate({ _id, userId }, {...restaurant, userId}, {new: true})
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})
// 刪除一筆資料
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// 匯出路由器
module.exports = router