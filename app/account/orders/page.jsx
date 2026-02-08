"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import AccountSidebar from "@/components/account-sidebar"
import useSWR from "swr"
import { Button } from "@/components/ui/button"

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

function StatusIcon({ status }) {
  switch (status) {
    case "Delivered":
      return <CheckCircle className="h-4 w-4" />
    case "In Transit":
      return <Truck className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

function statusColor(status) {
  switch (status) {
    case "Delivered":
      return "text-green-600"
    case "In Transit":
      return "text-amber-600"
    default:
      return "text-muted-foreground"
  }
}

export default function OrdersPage() {
  const {
    data: orders,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/account/orders", fetcher)
  const [expandedOrder, setExpandedOrder] = useState(null)

  if (error) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Failed to load orders. Please try again.
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
            <p className="text-muted-foreground">View your order history</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <AccountSidebar />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <h2 className="font-serif text-2xl mb-8">Order History</h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !orders || orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-6">
                    {"You haven't placed any orders yet."}
                  </p>
                  <Link
                    href="/"
                    className="text-sm tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-border"
                    >
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.orderId
                              ? null
                              : order.orderId
                          )
                        }
                        className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <span className="font-mono text-sm">
                            {order.orderId}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span
                            className={`flex items-center gap-1.5 text-sm ${statusColor(order.status)}`}
                          >
                            <StatusIcon status={order.status} />
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm hidden sm:block">
                            ${order.total.toLocaleString()}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${
                              expandedOrder === order.orderId
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedOrder === order.orderId && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 border-t border-border">
                              <div className="space-y-4 pt-6">
                                {order.items.map((item, i) => (
                                  <div
                                    key={`${order._id}-item-${i}`}
                                    className="flex gap-4 group"
                                  >
                                    <div className="w-16 h-20 bg-muted flex-shrink-0 relative overflow-hidden">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        sizes="64px"
                                        loading="lazy"
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-serif text-sm">
                                        {item.name}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {item.color} / {item.size}
                                      </p>
                                    </div>
                                    <div className="text-sm">
                                      ${item.price.toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t border-border">
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    {"Order Total: "}
                                  </span>
                                  <span className="font-medium">
                                    ${order.total.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex gap-4">
                                  <button className="text-sm underline underline-offset-4 hover:no-underline transition-all">
                                    View Invoice
                                  </button>
                                  {order.status === "In Transit" && (
                                    <button className="text-sm underline underline-offset-4 hover:no-underline transition-all">
                                      Track Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
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