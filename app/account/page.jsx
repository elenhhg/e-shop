"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Loader2, User, Mail, Phone, Calendar, Package, MapPin, Settings, LogOut, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const fetcher = async (url) => {
  const response = await fetch(url)
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await response.json()
    error.status = response.status
    throw error
  }
  
  return response.json()
}

export default function AccountPage() {
  const router = useRouter()
  const { signOut } = useClerk()
  const [signingOut, setSigningOut] = useState(false)
  
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
              <p className="text-muted-foreground">Manage your account and preferences</p>
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
              <p className="text-muted-foreground">Manage your account and preferences</p>
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
                  <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
                    <User className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-serif text-xl text-red-700 mb-2">Error Loading Profile</h3>
                  <p className="text-red-600 mb-6">{error.info?.error || error.message}</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => mutate()}
                      variant="outline"
                      className="border-red-200 hover:bg-red-100"
                    >
                      Try Again
                    </Button>
                    <Link href="/sign-in">
                      <Button className="bg-black text-white hover:bg-gray-800">
                        Sign In Again
                      </Button>
                    </Link>
                  </div>
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
            <p className="text-muted-foreground">Welcome back, {profile?.firstName || "Valued Customer"}!</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <div className="max-w-3xl">
                {/* Welcome Section with Sign Out */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-2xl">Dashboard</h2>
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
                
                {/* Profile Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border border-border rounded-lg p-6 mb-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-muted rounded-full">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg">
                        {profile?.firstName || "Your"} {profile?.lastName || "Name"}
                      </h3>
                      <p className="text-sm text-muted-foreground">Personal Information</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>Full Name</span>
                      </div>
                      <p className="font-medium">
                        {profile?.firstName || "Not set"} {profile?.lastName || ""}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>Email</span>
                      </div>
                      <p className="font-medium">{profile?.email || "No email"}</p>
                    </div>

                    {profile?.phone && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>Phone</span>
                        </div>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    )}

                    {profile?.birthday && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Birthday</span>
                        </div>
                        <p className="font-medium">
                          {new Date(profile.birthday).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <Link href="/account/profile">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {/* Quick Links Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Orders */}
                  <Link href="/account/orders">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="group border border-border rounded-lg p-6 hover:bg-muted/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="p-2 bg-muted rounded-full w-fit mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Package className="h-5 w-5" />
                      </div>
                      <h3 className="font-serif text-lg mb-2 group-hover:text-foreground transition-colors">
                        Order History
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        View and track your orders, check order status
                      </p>
                    </motion.div>
                  </Link>

                  {/* Addresses */}
                  <Link href="/account/addresses">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="group border border-border rounded-lg p-6 hover:bg-muted/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="p-2 bg-muted rounded-full w-fit mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h3 className="font-serif text-lg mb-2 group-hover:text-foreground transition-colors">
                        Addresses
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your shipping and billing addresses
                      </p>
                    </motion.div>
                  </Link>

                  

                  {/* Payment Methods (αν το έχεις) */}
                  <Link href="/account/payment">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="group border border-border rounded-lg p-6 hover:bg-muted/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="p-2 bg-muted rounded-full w-fit mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <h3 className="font-serif text-lg mb-2 group-hover:text-foreground transition-colors">
                        Payment Methods
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your saved payment methods
                      </p>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <PremiumFooter />
    </>
  )
}