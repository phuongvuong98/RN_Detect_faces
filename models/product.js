const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  category: String,
  imageUrl: {
    type: String,
    default: "https://ucarecdn.com/5d276379-552f-4a08-97e7-744a15f71477/ava.png"
  },
  price: Number,
  size: [],
  description: String,
  create_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date
  },
  delete_at: {
    type: Date
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  strict: false
});

module.exports = mongoose.model('Product', ProductSchema);