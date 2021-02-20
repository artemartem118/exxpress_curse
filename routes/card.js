const { Router } = require('express')
const Course = require('../models/course')
const router = Router()

const mapCartItems = (cart) => {
  return cart.items.map(c => ({
    ...c.courseId._doc, count: c.count
  }))
}

const computePrice = (courses) => (courses
  .reduce((total, c) => (total += c.price * c.count), 0))


router.post('/add', async (req, res) => {
  const { id } = req.body
  const course = await Course.findById(id)
  console.log(course)
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate()
  const courses = mapCartItems(user.cart)
  res.render('card', {
    isCard: true,
    courses: courses,
    price: computePrice(courses)
  })
})

router.delete('/remove/:id', async (req, res) => {
  const { id } = req.params
  const card = await Card.remove(id)
  res.json(card)
})

module.exports = router
