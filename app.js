// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')


// require express-handlebars here
const exphbs = require('express-handlebars')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })   // 設定連線到 mongoDB

// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

const Restaurant = require('./models/restaurant');

// routes setting
app.get('/', (req, res) => {
  // console.log(Restaurant)
  Restaurant.find((err, restaurants) => {                                 // 把 Restaurant model 所有的資料都抓回來
    // console.log(restaurants)
    if (err) return console.error(err)
    return res.render('index', { restaurants: restaurants })  // 將資料傳給 index 樣板
  })

})

// 列出全部 restaurants
app.get('/restaurants', (req, res) => {
  return res.render('index')
})
//
app.get('/search', (req, res) => {
  Restaurant.find((err, restaurants) => {
    const keyword = req.query.keyword
    restaurants = restaurants.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render('index', { restaurants: restaurants, keyword: keyword })
  })
})

//restaurant intro
app.get('/restaurants/:id', (req, res) => {
  // console.log(req.params.id)
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('show', { restaurant: restaurant })
  })
})

// 修改 restaurants 頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('edit', { restaurant: restaurant })
  })
})

// 修改 restaurants
app.post('/restaurants/:id', (req, res) => {
  // console.log(req.body)
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    for (i in req.body) {
      console.log(req.body[i])
      restaurant[i] = req.body[i]
    }
    // restaurant.rating = req.body.rating
    // restaurant.name = req.body.name
    console.log(restaurant.rating)
    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})



app.post('/restaurants/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})