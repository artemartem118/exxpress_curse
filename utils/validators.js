const { body } = require('express-validator')

module.exports = [
  body('email').isEmail().withMessage('Введите корректный email'),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6, max: 56 }).isAlphanumeric(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совподать')
    }
    return true
  }),
  body('name', 'Имя минимум 3 символа').isLength({ min: 3, max: 56 })
]
