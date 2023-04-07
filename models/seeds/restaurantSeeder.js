const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results
db.once('open', () => {
  console.log('mongodb connected!')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder created')
      db.close()
    })
    .catch((error) => console.log(error))
})