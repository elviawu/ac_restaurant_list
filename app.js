const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

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