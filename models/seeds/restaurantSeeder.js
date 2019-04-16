const mongoose = require('mongoose')
const restaurant = require('../restaurant')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

const restaurantList = require('./restaurant.json')


// console.log(restaurantList.results)

let mydata = restaurantList.results
// console.log(mydata)
for (i in mydata) {
  // console.log(mydata[i])  
  restaurant.create(mydata[i])
  console.log('done')
  console.log('----------------------')
}

