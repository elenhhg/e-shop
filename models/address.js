import mongoose from "mongoose"

const addressSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    label: { type: String, required: true },
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: "United States" },
    phone: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema)
export default Address