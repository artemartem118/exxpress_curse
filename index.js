const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const csurf = require('csurf')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const keys = require('./keys/index')


const homeRoute = require('./routes/home')
const coursesRoute = require('./routes/courses')
const addCourseRoute = require('./routes/add-course')
const cardRoute = require('./routes/card')
const ordersRoute = require('./routes/orders')
const authRoute = require('./routes/auth')


const app = express()
const store = MongoStore({
  collections: 'sessions',
  uri: keys.MONGODB_URI
})

app.set('view engine', 'pug')


app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(csurf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoute)
app.use('/courses', coursesRoute)
app.use('/add-course', addCourseRoute)
app.use('/card', cardRoute)
app.use('/orders', ordersRoute)
app.use('/auth', authRoute)


const start = async () => {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    app.listen(keys.PORT, () => {
      console.log(`server is running: http://localhost:${keys.PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()


const hzCho = '<dbname>?retryWrites=true&w=majority'



