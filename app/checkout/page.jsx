"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lock, CreditCard, Truck, ArrowLeft, Trash2 } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"

export default function CheckoutPage() {
  const { items, totalPrice, removeItem, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const shipping = 0 // Free shipping
  const tax = totalPrice * 0.08
  const total = totalPrice + shipping + tax

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    alert("Order placed successfully!")
    clearCart()
    setIsProcessing(false)
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
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-12">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-12">
                {/* Contact Information */}
                <section>
                  <h2 className="text-xl font-light mb-6">
                    Contact Information
                  </h2>

                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-sm text-muted-foreground"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          required
                          placeholder="First name"
                          className="mt-2 h-12 border-border"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-sm text-muted-foreground"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          required
                          placeholder="Last name"
                          className="mt-2 h-12 border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm text-muted-foreground"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="Email address"
                        className="mt-2 h-12 border-border"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm text-muted-foreground"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Phone number"
                        className="mt-2 h-12 border-border"
                      />
                    </div>
                  </div>
                </section>

                <Separator className="bg-border" />

                {/* Shipping Address */}
                <section>
                  <h2 className="text-xl font-light mb-6">
                    Shipping Address
                  </h2>

                  <div className="grid gap-4">
                    <div>
                      <Label
                        htmlFor="address"
                        className="text-sm text-muted-foreground"
                      >
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        required
                        placeholder="Street address"
                        className="mt-2 h-12 border-border"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="apartment"
                        className="text-sm text-muted-foreground"
                      >
                        Apartment, Suite, etc. (optional)
                      </Label>
                      <Input
                        id="apartment"
                        placeholder="Apartment, suite, etc."
                        className="mt-2 h-12 border-border"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor="city"
                          className="text-sm text-muted-foreground"
                        >
                          City
                        </Label>
                        <Input
                          id="city"
                          required
                          placeholder="City"
                          className="mt-2 h-12 border-border"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="state"
                          className="text-sm text-muted-foreground"
                        >
                          State
                        </Label>
                        <Input
                          id="state"
                          required
                          placeholder="State"
                          className="mt-2 h-12 border-border"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="zip"
                          className="text-sm text-muted-foreground"
                        >
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          required
                          placeholder="ZIP"
                          className="mt-2 h-12 border-border"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="bg-border" />

                {/* Payment Method */}
                <section>
                  <h2 className="text-xl font-light mb-6">
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                        paymentMethod === "card"
                          ? "border-foreground"
                          : "border-border"
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
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-foreground"
                          : "border-border"
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
                        <Label
                          htmlFor="cardNumber"
                          className="text-sm text-muted-foreground"
                        >
                          Card Number
                        </Label>
                        <Input
                          id="cardNumber"
                          required
                          placeholder="1234 5678 9012 3456"
                          className="mt-2 h-12 border-border"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="expiry"
                            className="text-sm text-muted-foreground"
                          >
                            Expiry Date
                          </Label>
                          <Input
                            id="expiry"
                            required
                            placeholder="MM / YY"
                            className="mt-2 h-12 border-border"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="cvv"
                            className="text-sm text-muted-foreground"
                          >
                            CVV
                          </Label>
                          <Input
                            id="cvv"
                            required
                            placeholder="123"
                            className="mt-2 h-12 border-border"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-secondary p-8 sticky top-24">
                  <h2 className="text-xl font-light mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-6 mb-8">
                    {items.map((item) => (
                      <div key={`${item.product._id || item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                        <div className="relative w-20 h-20 bg-muted overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">
                            {item.product.name}
                          </h3>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.selectedColor && item.selectedColor}
                              {item.selectedColor && item.selectedSize && " / "}
                              {item.selectedSize && item.selectedSize}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm mt-2">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(
                            item.product._id || item.product.id,
                            item.selectedSize,
                            item.selectedColor
                          )}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-border mb-6" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Subtotal
                      </span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Shipping
                      </span>
                      <span>
                        {shipping === 0
                          ? "Complimentary"
                          : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tax
                      </span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="bg-border my-6" />

                  <div className="flex justify-between text-lg mb-8">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-14 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90"
                  >
                    {isProcessing ? "Processing..." : "Complete Order"}
                  </Button>

                  <div className="flex justify-center gap-6 mt-8 text-muted-foreground">
                    <div className="flex items-center gap-2 text-xs">
                      <Lock className="h-4 w-4" />
                      Secure
                    </div>
                    <div className="flex items-center gap-2 text-xs">
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
