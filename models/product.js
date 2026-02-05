import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
  {
    id: String,
    name: {
      type: String,
      required: [true, "Please provide a product name"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
    },
    image: {
      type: String,
      required: [true, "Please provide a product image"],
    },
    hoverImage: String,
    images: [String],
    category: {
      type: String,
      required: [true, "Please provide a product category"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation error in development
// Third argument explicitly sets the collection name to "products"
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema, "products")

export default Product
