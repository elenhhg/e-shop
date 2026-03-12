"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, 
  CreditCard, 
  Trash2, 
  Star, 
  Plus,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"
import { useUser } from "@clerk/nextjs"

const fetcher = async (url) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' }
  })
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await response.json()
    error.status = response.status
    throw error
  }
  
  return response.json()
}

const cardBrands = {
  visa: { name: 'Visa', color: 'text-blue-600' },
  mastercard: { name: 'Mastercard', color: 'text-orange-600' },
  amex: { name: 'American Express', color: 'text-indigo-600' },
  discover: { name: 'Discover', color: 'text-purple-600' },
  default: { name: 'Card', color: 'text-gray-600' }
}

export default function PaymentPage() {
  const { isLoaded, isSignedIn } = useUser()
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [newCard, setNewCard] = useState({
    cardHolderName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    isDefault: false
  })

  const { data: paymentMethods, error, isLoading, mutate } = useSWR(
    isLoaded && isSignedIn ? "/api/account/payment" : null,
    fetcher,
    {
      onError: (err) => {
        console.error("Payment fetch error:", err)
        if (err.status === 401) {
          toast.error("Please sign in to view payment methods")
        }
      }
    }
  )

  const getCardBrand = (number) => {
    const firstDigit = number?.[0]
    if (firstDigit === '4') return cardBrands.visa
    if (firstDigit === '5') return cardBrands.mastercard
    if (firstDigit === '3') return cardBrands.amex
    if (firstDigit === '6') return cardBrands.discover
    return cardBrands.default
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewCard(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    
    // Format with spaces every 4 digits
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim()
    
    setNewCard(prev => ({
      ...prev,
      cardNumber: formatted
    }))
  }

  const handleExpiryChange = (e) => {
    const { name, value } = e.target
    let formatted = value.replace(/\D/g, '')
    if (formatted.length > 2 && name === 'expMonth') {
      formatted = formatted.slice(0, 2)
    }
    if (formatted.length > 4 && name === 'expYear') {
      formatted = formatted.slice(0, 4)
    }
    
    setNewCard(prev => ({
      ...prev,
      [name]: formatted
    }))
  }

  const handleAddCard = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate
      if (newCard.cardNumber.replace(/\s/g, '').length < 15) {
        toast.error("Please enter a valid card number")
        return
      }

      if (newCard.expMonth.length < 2 || newCard.expYear.length < 4) {
        toast.error("Please enter a valid expiry date")
        return
      }

      const cardNumberClean = newCard.cardNumber.replace(/\s/g, '')
      const brand = getCardBrand(cardNumberClean)

      const res = await fetch("/api/account/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardLast4: cardNumberClean.slice(-4),
          cardBrand: brand.name,
          cardExpMonth: newCard.expMonth,
          cardExpYear: newCard.expYear,
          cardHolderName: newCard.cardHolderName,
          isDefault: newCard.isDefault
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to add card")
        return
      }

      await mutate()
      setShowAddForm(false)
      setNewCard({
        cardHolderName: "",
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvv: "",
        isDefault: false
      })
      toast.success("Card added successfully")
    } catch (error) {
      console.error("Add card error:", error)
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`/api/account/payment?id=${id}&action=set-default`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to set default card")
        return
      }

      await mutate()
      toast.success("Default card updated")
    } catch (error) {
      console.error("Set default error:", error)
      toast.error("Something went wrong")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this card?")) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/account/payment?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to remove card")
        return
      }

      await mutate()
      toast.success("Card removed successfully")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  if (!isLoaded) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20 flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <PremiumFooter />
      </>
    )
  }

  if (!isSignedIn) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
            <div className="text-center py-16 border border-border rounded-lg">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-serif text-2xl mb-2">Sign in Required</h2>
              <p className="text-muted-foreground mb-6">Please sign in to manage your payment methods.</p>
              <Button className="bg-black text-white hover:bg-gray-800">
                Sign In
              </Button>
            </div>
          </div>
        </main>
        <PremiumFooter />
      </>
    )
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl lg:text-4xl mb-2">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your saved cards and payment options</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 max-w-2xl"
            >
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-red-700 mb-2">Error Loading Payment Methods</h3>
                  <p className="text-red-600 mb-6">{error.info?.error || error.message}</p>
                  <Button
                    onClick={() => mutate()}
                    variant="outline"
                    className="border-red-200 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Add Card Button */}
                  {!showAddForm && (
                    <Button
                      onClick={() => setShowAddForm(true)}
                      variant="outline"
                      className="w-full border-dashed py-8 hover:bg-muted/30"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Card
                    </Button>
                  )}

                  {/* Add Card Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border border-border rounded-lg p-6 bg-muted/10">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-serif text-lg">Add New Card</h3>
                            <button
                              onClick={() => setShowAddForm(false)}
                              className="p-1 hover:bg-muted rounded-full"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <form onSubmit={handleAddCard} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardHolderName">Cardholder Name</Label>
                              <Input
                                id="cardHolderName"
                                name="cardHolderName"
                                value={newCard.cardHolderName}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                                className="bg-transparent"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={newCard.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="4242 4242 4242 4242"
                                required
                                className="bg-transparent font-mono"
                              />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor="expMonth">Month</Label>
                                <Input
                                  id="expMonth"
                                  name="expMonth"
                                  value={newCard.expMonth}
                                  onChange={handleExpiryChange}
                                  placeholder="MM"
                                  maxLength={2}
                                  required
                                  className="bg-transparent text-center"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="expYear">Year</Label>
                                <Input
                                  id="expYear"
                                  name="expYear"
                                  value={newCard.expYear}
                                  onChange={handleExpiryChange}
                                  placeholder="YYYY"
                                  maxLength={4}
                                  required
                                  className="bg-transparent text-center"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  name="cvv"
                                  value={newCard.cvv}
                                  onChange={handleInputChange}
                                  placeholder="123"
                                  maxLength={4}
                                  required
                                  className="bg-transparent text-center"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={newCard.isDefault}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-border"
                              />
                              <Label htmlFor="isDefault" className="text-sm cursor-pointer">
                                Set as default payment method
                              </Label>
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-black text-white hover:bg-gray-800"
                              >
                                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Add Card
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddForm(false)}
                                disabled={saving}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Saved Cards */}
                  {paymentMethods?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-serif text-lg mb-3">Saved Cards</h3>
                      {paymentMethods.map((method, index) => (
                        <motion.div
                          key={method._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`border border-border rounded-lg p-4 ${
                            method.isDefault ? 'bg-muted/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{method.cardBrand}</span>
                                  {method.isDefault && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  •••• •••• •••• {method.cardLast4}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Expires {method.cardExpMonth}/{method.cardExpYear}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {!method.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSetDefault(method._id)}
                                  className="text-xs"
                                >
                                  <Star className="h-3.5 w-3.5 mr-1" />
                                  Set Default
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(method._id)}
                                disabled={deletingId === method._id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {deletingId === method._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {(!paymentMethods || paymentMethods.length === 0) && !showAddForm && (
                    <div className="text-center py-16 border border-dashed border-border rounded-lg">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-serif text-xl mb-2">No payment methods</h3>
                      <p className="text-muted-foreground mb-6">
                        Add your first card to start shopping
                      </p>
                    </div>
                  )}

                  {/* Security Note */}
                  <p className="text-xs text-muted-foreground text-center pt-4">
                    Your payment information is encrypted and secure. We never store full card numbers.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <PremiumFooter />
    </>
  )
}