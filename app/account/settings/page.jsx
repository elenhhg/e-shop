"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import useSWR from "swr"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((res) => res.json())

export default function SettingsPage() {
  const {
    data: settings,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/account/settings", fetcher)

  async function updateSetting(key, value) {
    if (!settings) return

    const updated = { ...settings, [key]: value }

    mutate(updated, false)

    try {
      const res = await fetch("/api/account/settings", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(updated),

      })

      if (!res.ok) {
        mutate()
        toast.error("Failed to update setting")
        return
      }

      toast.success("Setting updated")
    } catch {
      mutate()
      toast.error("Something went wrong")
    }
  }

  if (error) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Failed to load settings. Please try again.
              </p>
              <Button onClick={() => mutate()} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </main>
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
            <p className="text-muted-foreground">
              Manage your preferences and settings
            </p>
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {/* Email Preferences */}
                    <section className="mb-12">
                      <h2 className="font-serif text-2xl mb-6">
                        Email Preferences
                      </h2>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between py-4 border-b border-border">
                          <div>
                            <Label className="text-sm font-medium">
                              New Arrivals
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Be the first to know about new collections
                            </p>
                          </div>
                          <Switch
                            checked={settings?.newArrivals ?? true}
                            onCheckedChange={(v) =>
                              updateSetting("newArrivals", v)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-border">
                          <div>
                            <Label className="text-sm font-medium">
                              Exclusive Offers
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Receive special promotions and private sales
                            </p>
                          </div>
                          <Switch
                            checked={settings?.exclusiveOffers ?? true}
                            onCheckedChange={(v) =>
                              updateSetting("exclusiveOffers", v)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-border">
                          <div>
                            <Label className="text-sm font-medium">
                              Order Updates
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Shipping confirmations and delivery notifications
                            </p>
                          </div>
                          <Switch
                            checked={settings?.orderUpdates ?? true}
                            onCheckedChange={(v) =>
                              updateSetting("orderUpdates", v)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-border">
                          <div>
                            <Label className="text-sm font-medium">
                              Editorial Content
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Stories, styling tips, and behind-the-scenes
                            </p>
                          </div>
                          <Switch
                            checked={settings?.editorialContent ?? false}
                            onCheckedChange={(v) =>
                              updateSetting("editorialContent", v)
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Privacy */}
                    <section className="mb-12">
                      <h2 className="font-serif text-2xl mb-6">Privacy</h2>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between py-4 border-b border-border">
                          <div>
                            <Label className="text-sm font-medium">
                              Personalized Recommendations
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Allow us to suggest items based on your preferences
                            </p>
                          </div>
                          <Switch
                            checked={
                              settings?.personalizedRecommendations ?? true
                            }
                            onCheckedChange={(v) =>
                              updateSetting("personalizedRecommendations", v)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-border">
                          <div>
                            <Label className="text-sm font-medium">
                              Analytics Cookies
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Help us improve your experience
                            </p>
                          </div>
                          <Switch
                            checked={settings?.analyticsCookies ?? true}
                            onCheckedChange={(v) =>
                              updateSetting("analyticsCookies", v)
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Account / Danger Zone */}
                    <section className="pt-8 border-t border-border">
                      <h2 className="font-serif text-2xl mb-6">Account</h2>

                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Download Your Data
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Request a copy of all your personal data
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="text-sm tracking-[0.1em] uppercase bg-transparent"
                            onClick={() =>
                              toast.info(
                                "Data export requested. You will receive an email shortly."
                              )
                            }
                          >
                            Request Data
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                          <div>
                            <Label className="text-sm font-medium text-red-600">
                              Delete Account
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="text-sm tracking-[0.1em] uppercase text-red-600 border-red-600/30 hover:bg-red-600/10 hover:text-red-600 bg-transparent"
                            onClick={() =>
                              toast.error(
                                "Account deletion is not available in demo mode."
                              )
                            }
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <PremiumFooter />
    </>
  )
}
