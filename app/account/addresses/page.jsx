"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Loader2, X, MapPin, Phone, Home, Building, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import useSWR from "swr"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"

const fetcher = async (url) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await response.json()
    error.status = response.status
    throw error
  }
  
  return response.json()
}

const emptyAddress = {
  label: "",
  isDefault: false,
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
}

export default function AddressesPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { data: addresses, isLoading, error, mutate } = useSWR(
    isLoaded && isSignedIn ? "/api/account/addresses" : null,
    fetcher,
    {
      onError: (err) => {
        console.error("SWR error:", err)
        if (err.status === 401) {
          toast.error("Please sign in again")
        }
      }
    }
  )

  const [showForm, setShowForm] = useState(false)
  const [editAddress, setEditAddress] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  function openAddForm() {
    setEditAddress({ ...emptyAddress })
    setShowForm(true)
  }

  function openEditForm(address) {
    setEditAddress({ ...address })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditAddress(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!editAddress) return

    setSaving(true)
    const isEditing = !!editAddress._id

    try {
      const res = await fetch("/api/account/addresses", {
        method: isEditing ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(editAddress),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to save address")
        return
      }

      await mutate()
      closeForm()
      toast.success(isEditing ? "Address updated" : "Address added")
    } catch (err) {
      console.error("Error:", err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/account/addresses?id=${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        },
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to delete address")
        return
      }

      await mutate()
      toast.success("Address removed")
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  function getLabelIcon(label) {
    const lower = label?.toLowerCase() || ""
    if (lower.includes("home")) return <Home className="h-3 w-3" />
    if (lower.includes("work") || lower.includes("office")) return <Building className="h-3 w-3" />
    return <MapPin className="h-3 w-3" />
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
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-serif text-2xl mb-2">Sign in Required</h2>
              <p className="text-muted-foreground mb-6">Please sign in to view your addresses.</p>
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
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl mb-2">My Addresses</h1>
              <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
            </div>
            <Button onClick={openAddForm} className="bg-black text-white hover:bg-gray-800 whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-8 text-center">
                  <p className="text-red-600 mb-4">Error loading addresses: {error.message}</p>
                  <Button onClick={() => mutate()} variant="outline" className="border-red-200 hover:bg-red-100">
                    Try Again
                  </Button>
                </div>
              ) : !addresses || addresses.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-lg">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-serif text-xl mb-2">No addresses saved</h3>
                  <p className="text-muted-foreground mb-6">Add your first address to get started</p>
                  <Button onClick={openAddForm} className="bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <motion.div
                      key={address._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors relative group"
                    >
                      {address.isDefault && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Default
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-muted rounded-full">
                          {getLabelIcon(address.label)}
                        </div>
                        <span className="font-serif text-sm uppercase tracking-wider text-muted-foreground">
                          {address.label || "Address"}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        <p className="font-medium">{address.name}</p>
                        <p className="text-sm text-muted-foreground">{address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                        {address.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                            <Phone className="h-3.5 w-3.5" />
                            {address.phone}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(address)}
                          className="text-sm hover:bg-muted flex-1"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(address._id)}
                            disabled={deletingId === address._id}
                            className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                          >
                            {deletingId === address._id ? (
                              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            )}
                            Delete
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Address Form Modal */}
      <AnimatePresence>
        {showForm && editAddress && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closeForm}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto">
                <div className="sticky top-0 bg-background border-b border-border p-4 flex justify-between items-center">
                  <h3 className="font-serif text-xl">
                    {editAddress._id ? "Edit Address" : "Add New Address"}
                  </h3>
                  <button
                    onClick={closeForm}
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    disabled={saving}
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Address Label */}
                    <div className="space-y-2">
                      <Label htmlFor="label" className="text-sm font-medium">
                        Address Label <span className="text-muted-foreground text-xs">(e.g., Home, Work)</span>
                      </Label>
                      <Input
                        id="label"
                        value={editAddress.label}
                        onChange={(e) =>
                          setEditAddress({ ...editAddress, label: e.target.value })
                        }
                        placeholder="Home"
                        required
                        className="bg-transparent border-border"
                      />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editAddress.name}
                        onChange={(e) =>
                          setEditAddress({ ...editAddress, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                        className="bg-transparent border-border"
                      />
                    </div>

                    {/* Street */}
                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-sm font-medium">
                        Street Address
                      </Label>
                      <Input
                        id="street"
                        value={editAddress.street}
                        onChange={(e) =>
                          setEditAddress({ ...editAddress, street: e.target.value })
                        }
                        placeholder="123 Main St"
                        required
                        className="bg-transparent border-border"
                      />
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City
                        </Label>
                        <Input
                          id="city"
                          value={editAddress.city}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, city: e.target.value })
                          }
                          placeholder="New York"
                          required
                          className="bg-transparent border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">
                          State
                        </Label>
                        <Input
                          id="state"
                          value={editAddress.state}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, state: e.target.value })
                          }
                          placeholder="NY"
                          required
                          className="bg-transparent border-border"
                        />
                      </div>
                    </div>

                    {/* ZIP and Country */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-sm font-medium">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          value={editAddress.zip}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, zip: e.target.value })
                          }
                          placeholder="10001"
                          required
                          className="bg-transparent border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium">
                          Country
                        </Label>
                        <Input
                          id="country"
                          value={editAddress.country}
                          onChange={(e) =>
                            setEditAddress({ ...editAddress, country: e.target.value })
                          }
                          placeholder="United States"
                          required
                          className="bg-transparent border-border"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        value={editAddress.phone}
                        onChange={(e) =>
                          setEditAddress({ ...editAddress, phone: e.target.value })
                        }
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        className="bg-transparent border-border"
                      />
                    </div>

                    {/* Default checkbox */}
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={editAddress.isDefault}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            isDefault: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-border text-black focus:ring-black"
                      />
                      <Label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
                        Set as default address
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {editAddress._id ? "Update Address" : "Add Address"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeForm}
                      disabled={saving}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PremiumFooter />
    </>
  )
}