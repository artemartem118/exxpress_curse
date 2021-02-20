const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', (req, res) => {
  res.render('add-course', {
    isAddCourse: true
  })
})

router.post('/', async (req, res) => {
  const { title, price, imgUrl } = req.body
  const course = new Course({
    title,
    price,
    imgUrl,
    userId: req.user
  })

  try {
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
