import mongoose from "mongoose"

const SettingsSchema = new mongoose.Schema(
  {
    newArrivals: { type: Boolean, default: true },
    exclusiveOffers: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    editorialContent: { type: Boolean, default: false },
    personalizedRecommendations: { type: Boolean, default: true },
    analyticsCookies: { type: Boolean, default: true },
  },
  { _id: false }
)

const PaymentMethodSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      enum: ['card', 'paypal'], 
      default: 'card' 
    },
    isDefault: { type: Boolean, default: false },
    
    // Card fields
    cardLast4: String,
    cardBrand: String,
    cardExpMonth: String,
    cardExpYear: String,
    cardHolderName: String,
    
    // PayPal fields
    paypalEmail: String,
    
    // For Stripe integration (future)
    stripePaymentMethodId: String,
  },
  { timestamps: true }
)

const UserSchema = new mongoose.Schema(
  {
    clerkId: { 
      type: String, 
      unique: true, 
      index: true,
      required: true 
    },
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    birthday: Date,
    settings: { 
      type: SettingsSchema, 
      default: () => ({
        newArrivals: true,
        exclusiveOffers: true,
        orderUpdates: true,
        editorialContent: false,
        personalizedRecommendations: true,
        analyticsCookies: true,
      })
    },
    paymentMethods: [PaymentMethodSchema],
  },
  { timestamps: true }
)

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model("User", UserSchema)