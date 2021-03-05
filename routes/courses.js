const { Router } = require('express')
const Courses = require('../models/course')
const auth = require('../middleware/auth')

const router = Router()

router.get('/', async (req, res) => {
  const courses = await Courses.find()
    .populate('userId', 'email name')

  res.render('courses', {
    isCourses: true,
    courses
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  const { id } = req.params
  const { allow } = req.query

  if (!allow) {
    return res.redirect('/')
  }

  const courseItem = await Courses.findById(id)
  res.render('edit-course', {
    courseItem
  })
})

router.post('/edit', auth, async (req, res) => {
  const { id, title, price, imgUrl } = req.body
  await Courses.findByIdAndUpdate(id, { title, price, imgUrl })
  res.redirect('/courses')
})

router.post('/remove/', auth, async (req, res) => {
  const { id } = req.body
  try {
    await Courses.deleteOne({ _id: id })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const courseItem = await Courses.findById(id)
  res.render('course-item', {
    courseItem
  })
})

module.exports = router
