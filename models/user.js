const { Schema, model } = require('mongoose')
const cartItem = new Schema({
  name: String,
  count: {
    type: Number,
    required: true,
    default: 1
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, { _id: false })
const user = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [cartItem]
  }
})

user.methods.addToCart = function (course) {
  const items = [...this.cart.items]
  const idx = items.findIndex(c => c.courseId.toString() === course.id.toString())

  if (idx >= 0) {
    items[idx].count += 1
  } else {
    items.push({
      courseId: course.id,
      count: 1
    })
  }

  this.cart = { items }
  return this.save()
}

user.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(c => c.courseId.toString() === id.toString())
  if (items[idx].count === 1) {
    items = items.filter(c => c.courseId.toString() !== id.toString())
  } else {
    items[idx].count--
  }
  this.cart = { items }
  return this.save()
}

user.methods.clearCart = function (id) {
  this.cart = { items: [] }
  return this.save()
}

module.exports = model('User', user)
