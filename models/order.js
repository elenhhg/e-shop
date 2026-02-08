import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  color: { type: String },
  size: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true,
    index: true 
  },
  orderId: { 
    type: String, 
    required: true,
    unique: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  status: { 
    type: String, 
    required: true,
    enum: ["Processing", "In Transit", "Delivered", "Cancelled"],
    default: "Processing" 
  },
  total: { 
    type: Number, 
    required: true 
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Apple Pay", "Google Pay"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending"
  }
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model("Order", orderSchema)