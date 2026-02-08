"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import useSWR from "swr"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

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

  // Open modal to add new address
  function openAddForm() {
    setEditAddress({ ...emptyAddress })
    setShowForm(true)
  }

  // Open modal to edit existing address
  function openEditForm(address) {
    setEditAddress({ ...address })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditAddress(null)
  }

  // Handle add/edit form submit
  async function handleSubmit(e) {
    e.preventDefault()
    if (!editAddress) return

    setSaving(true)
    const isEditing = !!editAddress._id

    try {
      console.log("Submitting address:", editAddress)
      
      const res = await fetch("/api/account/addresses", {
        method: isEditing ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(editAddress),
      })

      const data = await res.json()
      console.log("Server response:", data)

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

  // Delete an address
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }

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
    }
  }

  // If user is not loaded
  if (!isLoaded) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-24 flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8" />
        </main>
        <PremiumFooter />
      </>
    )
  }

  if (!isSignedIn) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl mb-4">You must be signed in</h2>
            <p>Please sign in to view your addresses.</p>
          </div>
        </main>
        <PremiumFooter />
      </>
    )
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-6 flex gap-12">
          <AccountSidebar />

          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl">Saved Addresses</h2>
              <Button onClick={openAddForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : error ? (
              <div className="text-red-500">
                Error loading addresses: {error.message}
              </div>
            ) : !addresses || addresses.length === 0 ? (
              <p className="text-gray-500">You have no saved addresses</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {addresses.map((a) => (
                  <div key={a._id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{a.label}</p>
                      {a.isDefault && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{a.name}</p>
                    <p className="text-sm mb-2">{a.street}</p>
                    <p className="text-sm mb-2">{a.city}, {a.state} {a.zip}</p>
                    <p className="text-sm mb-2">{a.country}</p>
                    {a.phone && <p className="text-sm mb-2">📞 {a.phone}</p>}

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(a)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {!a.isDefault && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(a._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ FORM MODAL */}
        {showForm && editAddress && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-background p-6 w-full max-w-md relative rounded-lg">
              <button
                onClick={closeForm}
                className="absolute top-4 right-4"
              >
                <X />
              </button>

              <h3 className="text-xl mb-4">
                {editAddress._id ? "Edit Address" : "Add Address"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  ["Label", "label"],
                  ["Full Name", "name"],
                  ["Street", "street"],
                  ["City", "city"],
                  ["State", "state"],
                  ["ZIP", "zip"],
                  ["Country", "country"],
                  ["Phone", "phone"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      required={key !== "phone"}
                      value={editAddress[key]}
                      onChange={(e) =>
                        setEditAddress({
                          ...editAddress,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}

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
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isDefault">
                    Set as default address
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <PremiumFooter />
    </>
  )
}