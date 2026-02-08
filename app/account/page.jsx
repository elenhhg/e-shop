"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import useSWR from "swr"
import { Loader2, User, Mail, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"

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

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-24">
          <div className="max-w-7xl mx-auto px-6 flex">
            <AccountSidebar />
            <div className="flex-1 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin" />
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
        <main className="min-h-screen pt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              <p className="font-semibold">Error loading profile</p>
              <p>{error.info?.error || error.message}</p>
              <Link href="/sign-in" className="text-blue-600 hover:underline mt-2 inline-block">
                Sign in again
              </Link>
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
      
      <main className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <AccountSidebar />
          
          <div className="flex-1">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-2">My Account</h1>
              <p className="text-gray-600 mb-8">Manage your personal information and preferences</p>
              
              {/* Profile Summary Card */}
              <div className="bg-white rounded-xl border p-6 mb-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {profile?.firstName || "Your"} {profile?.lastName || "Name"}
                    </h2>
                    <p className="text-gray-600">Personal Information</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>Name</span>
                    </div>
                    <p className="font-medium">
                      {profile?.firstName || "Not set"} {profile?.lastName || ""}
                    </p>
                  </div>

                  {profile?.phone && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span>Phone</span>
                      </div>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  )}

                  {profile?.birthday && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
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

                <div className="mt-6 flex gap-3">
                  <Link href="/account/profile">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                  <Link href="/account/addresses">
                    <Button>Manage Addresses</Button>
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/account/orders">
                  <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2">Order History</h3>
                    <p className="text-sm text-gray-600">View and track your orders</p>
                  </div>
                </Link>

                <Link href="/account/notifications">
                  <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    <p className="text-sm text-gray-600">Manage your preferences</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PremiumFooter />
    </>
  )
}