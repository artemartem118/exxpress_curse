const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const homeRoute = require('./routes/home')
const coursesRoute = require('./routes/courses')
const addCourseRoute = require('./routes/add-course')
const cardRoute = require('./routes/card')

const User = require('./models/user')

const app = express()

app.set('view engine', 'pug')

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('6025680def115410e0b5de06')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
})

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoute)
app.use('/courses', coursesRoute)
app.use('/add-course', addCourseRoute)
app.use('/card', cardRoute)

const PORT = process.env.PORT || 3000

const start = async () => {
  const mongoPass = 'ZkLI11VlB3BxyYU7'
  const mongoUrl = `mongodb+srv://artemartem:${mongoPass}@cluster0.f3jvu.mongodb.net/shop`
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'art@mail.ru',
        name: 'art',
        cart: { items: [] }
      })
      await user.save()
    }
    app.listen(PORT, () => {
      console.log(`server is running: http://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()


const hzCho = '<dbname>?retryWrites=true&w=majority'



