"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import useSWR from "swr"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, LogOut, User, Calendar, Phone, Mail, AlertTriangle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"

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

export default function ProfilePage() {
  const router = useRouter()
  const { signOut } = useClerk()
  const { data: profile, error, isLoading, mutate } = useSWR(
    "/api/account/profile",
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        console.error("Profile fetch error:", err)
        if (err.status === 401) {
          toast.error("Please sign in to view your profile")
        }
      }
    }
  )

  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const body = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      birthday: formData.get("birthday"),
    }

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to update profile")
        return
      }

      await mutate()
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut(() => {
        router.push("/")
        toast.success("Signed out successfully")
      })
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out")
    } finally {
      setSigningOut(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }

    setIsDeleting(true)
    try {
      // Here you would implement the actual account deletion
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      toast.success("Account deleted successfully")
      setShowDeleteModal(false)
      
      // Sign out and redirect after deletion
      await signOut(() => {
        router.push("/")
      })
    } catch (error) {
      console.error("Delete account error:", error)
      toast.error("Failed to delete account")
    } finally {
      setIsDeleting(false)
      setDeleteConfirmation("")
    }
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="font-serif text-3xl lg:text-4xl mb-2">
                My Account
              </h1>
              <p className="text-muted-foreground">Manage your profile information</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-12">
              <AccountSidebar />
              <div className="flex-1 flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </div>
          </div>
        </main>
        <PremiumFooter />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="font-serif text-3xl lg:text-4xl mb-2">
                My Account
              </h1>
              <p className="text-muted-foreground">Manage your profile information</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-12">
              <AccountSidebar />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1"
              >
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-red-700 mb-2">Error Loading Profile</h3>
                  <p className="text-red-600 mb-6">{error.info?.error || error.message}</p>
                  <Button
                    onClick={() => mutate()}
                    variant="outline"
                    className="border-red-200 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-serif text-3xl lg:text-4xl mb-2">
              My Account
            </h1>
            <p className="text-muted-foreground">Manage your profile information</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <div className="max-w-2xl">
                {/* Header with Sign Out */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl">Profile Information</h2>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    disabled={signingOut}
                    className="flex items-center gap-2"
                  >
                    {signingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    Sign Out
                  </Button>
                </div>
                
                {/* Profile Form - No white backgrounds */}
                <form onSubmit={handleProfileSubmit} className="space-y-6 mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        defaultValue={profile?.firstName || ""}
                        required
                        className="bg-transparent border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        defaultValue={profile?.lastName || ""}
                        required
                        className="bg-transparent border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profile?.email || ""}
                        disabled
                        className="pl-10 bg-muted/30 border-border text-muted-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={profile?.phone || ""}
                        className="pl-10 bg-transparent border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday" className="text-sm font-medium">
                      Birthday
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        defaultValue={profile?.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : ""}
                        className="pl-10 bg-transparent border-border"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={saving} 
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        document.getElementById("firstName").value = profile?.firstName || ""
                        document.getElementById("lastName").value = profile?.lastName || ""
                        document.getElementById("phone").value = profile?.phone || ""
                        document.getElementById("birthday").value = profile?.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : ""
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>

                {/* Danger Zone - No white background */}
                <div className="border-t border-border pt-8">
                  <h3 className="font-serif text-xl mb-4 text-red-600">Danger Zone</h3>
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50/50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-700 mb-1">Delete Account</h4>
                        <p className="text-sm text-red-600 mb-4">
                          Permanently delete your account and all associated data. 
                          This action cannot be undone.
                        </p>
                        <Button
                          variant="destructive"
                          onClick={() => setShowDeleteModal(true)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <PremiumFooter />

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {
                if (!isDeleting) {
                  setShowDeleteModal(false)
                  setDeleteConfirmation("")
                }
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-background border border-border rounded-lg shadow-xl p-6 mx-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="font-serif text-lg text-foreground">
                      Delete Account
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      if (!isDeleting) {
                        setShowDeleteModal(false)
                        setDeleteConfirmation("")
                      }
                    }}
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    disabled={isDeleting}
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    This action is <span className="font-semibold text-red-600">permanent</span> and cannot be undone. 
                    All your data, including orders, profile information, and preferences will be permanently deleted.
                  </p>
                  
                  <div className="bg-red-50/50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      Please type <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded">DELETE</span> to confirm:
                    </p>
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                      disabled={isDeleting}
                      className="bg-transparent border-red-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setDeleteConfirmation("")
                    }}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== "DELETE" || isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}