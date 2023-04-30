const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results
const userList = require('../../user.json')
db.once('open', () => {
  const userPromise = userList.map(seedUser => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => {
        return User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        })
          .catch(err => console.log(err))
      })
      .then(user => {
        console.log('user = ', user.email)
        const userRestaurants = seedUser.userRestaurants.map(item => {
          return Object.assign(restaurantList[item - 1], { userId: user._id })
        })
        return userRestaurants
      })
      .then(userRestaurants => {
        return Restaurant.create(userRestaurants)
      })
  })
  Promise.all(userPromise)
    .then(() => {
      console.log('Done !')
      // process.exit()
    })
    .catch(err => console.log(err))
})