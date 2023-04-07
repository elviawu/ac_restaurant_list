const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant') //載入Restaurant model

// 引用 body-parser
const bodyParser = require('body-parser')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  Restaurant.find() //取出Restaurant Model中所有資料
    .lean() //把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
    .then(restaurants => res.render('index', { restaurants: restaurants })) //將資料傳給index樣板
    .catch(error => console.log(error)) //錯誤處理
})
// 新增一筆資料
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
app.post('/restaurants', (req, res) => {
  const restaurant = req.body
  Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})
// 瀏覽資料細節
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})
// 修改一筆資料
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = req.body
  Restaurant.findByIdAndUpdate(id, restaurant)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})
// 刪除一筆資料
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
//搜尋餐廳或類別
app.get('/search', (req, res) => {
  if (!req.query.keywords) {
    res.redirect('/')
  }
  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  Restaurant.find({})
    .lean()
    .then(restaurants => {
      const filterRestaurantsData = restaurants.filter(data => data.name.toLowerCase().includes(keyword) || data.category.toLowerCase().includes(keyword))
      res.render('index', { restaurants: filterRestaurantsData, keywords })
    })
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})