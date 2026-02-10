// app/checkout/page.jsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Lock, CreditCard, Truck, ArrowLeft, Trash2, Loader2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, removeItem, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const shipping = 0 // Free shipping
  const tax = totalPrice * 0.08
  const total = totalPrice + shipping + tax

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData.entries())
      
      // Create order data
      const orderData = {
        items,
        total,
        shipping: shipping,
        tax: tax,
        subtotal: totalPrice,
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          apartment: data.apartment || "",
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: "United States"
        },
        paymentMethod,
        status: "pending"
      }

      // Send order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order")
      }

      toast.success("Order placed successfully!")
      
      // Clear cart after successful order
      await clearCart()
      
      // Redirect to order confirmation
      router.push(`/order/${result.orderId}`)
      
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(error.message || "Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-serif mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart to proceed with checkout.
            </p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <PremiumFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Back link */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </button>

          <h1 className="text-3xl lg:text-4xl font-serif mb-12">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-12">
                {/* Contact Information */}
                <section>
                  <h2 className="text-xl font-semibold mb-6">
                    Contact Information
                  </h2>

                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          placeholder="First name"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          placeholder="Last name"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Phone number"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Shipping Address */}
                <section>
                  <h2 className="text-xl font-semibold mb-6">
                    Shipping Address
                  </h2>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="address">
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        placeholder="Street address"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="apartment">
                        Apartment, Suite, etc. (optional)
                      </Label>
                      <Input
                        id="apartment"
                        name="apartment"
                        placeholder="Apartment, suite, etc."
                        className="mt-2"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          placeholder="City"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">
                          State
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          placeholder="State"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="zip">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          name="zip"
                          required
                          placeholder="ZIP"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Payment Method */}
                <section>
                  <h2 className="text-xl font-semibold mb-6">
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <CreditCard className="h-5 w-5" />
                        Credit / Debit Card
                      </Label>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === "paypal"
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label
                        htmlFor="paypal"
                        className="cursor-pointer flex-1"
                      >
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">
                          Card Number
                        </Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          required
                          placeholder="1234 5678 9012 3456"
                          className="mt-2"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">
                            Expiry Date
                          </Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            required
                            placeholder="MM / YY"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cvv">
                            CVV
                          </Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            required
                            placeholder="123"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-8 rounded-lg sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">
                    Order Summary
                  </h2>

                  {/* Προϊόντα στο Order Summary - ΤΟ ΝΕΟ ΜΕΡΟΣ */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => {
                      const itemKey = `${item.product.id}-${item.selectedSize}-${item.selectedColor}`
                      return (
                        <div key={itemKey} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.product.name}</span>
                            <span className="font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              {item.selectedColor && item.selectedColor}
                              {item.selectedColor && item.selectedSize && " / "}
                              {item.selectedSize && item.selectedSize}
                              <span className="ml-2">Qty: {item.quantity}</span>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Separator className="mb-6" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal
                      </span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Shipping
                      </span>
                      <span className="text-green-600">
                        Free
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Tax
                      </span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-between text-lg font-semibold mb-8">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 bg-black text-white hover:bg-gray-800"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <div className="flex justify-center gap-6 mt-8 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Secure
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Free Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <PremiumFooter />
    </main>
  )
}