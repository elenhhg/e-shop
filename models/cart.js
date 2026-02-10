// models/cart.js
import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
  product: {
    id: String,
    name: String,
    price: Number,
    image: String,
    category: String,
    slug: String
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  selectedSize: String,
  selectedColor: String
})

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Update the updatedAt timestamp on save
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema)