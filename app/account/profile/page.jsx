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
import { Loader2, LogOut } from "lucide-react"
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
    if (!confirm("Are you sure you want to sign out?")) {
      return
    }

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
          <div className="max-w-7xl mx-auto px-6 flex">
            <AccountSidebar />
            <div className="flex-1">
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                <p className="font-semibold">Error loading profile</p>
                <p>{error.info?.error || error.message}</p>
                <Button
                  onClick={() => mutate()}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
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
            <div className="max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Profile Information</h2>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
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
              
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={profile?.firstName || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={profile?.lastName || ""}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={profile?.phone || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    defaultValue={profile?.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : ""}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saving} className="flex-1">
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

              {/* Account Security Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Password</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Change your password to keep your account secure
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/account/change-password")}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/account/security")}
                    >
                      Set up 2FA
                    </Button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Delete Account</p>
                  <p className="text-sm text-red-600 mb-3">
                    Permanently delete your account and all associated data
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        toast.error("Account deletion is not implemented yet")
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PremiumFooter />
    </>
  )
}