const { Router } = require('express')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/user')
const validators = require('../utils/validators')

const router = Router()


router.get('/login', async (req, res) => {
  res.render('auth/login', {
    isLogin: true,
    registerError: req.flash('registerError'),
    loginError: req.flash('loginError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Неверный логин или пароль')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'Неверный логин или пароль')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/register', validators, async (req, res) => {
  try {
    const { email, password, confirm, name } = req.body
    const candidate = await User.findOne({ email })

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }
    if (candidate) {
      req.flash('registerError', 'Email уже занят')
      res.redirect('/auth/login#register')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email, password: hashPassword, name, cart: { items: [] }
      })
      await user.save()
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
