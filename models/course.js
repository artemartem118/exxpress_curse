const { model, Schema } = require('mongoose')

const course = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imgUrl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = model('Course', course)
