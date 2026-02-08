"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, MapPin, Bell, CreditCard, LayoutDashboard } from "lucide-react"

const menuItems = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/payment", label: "Payment Methods", icon: CreditCard },
]

export default function AccountSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href === "/account" && pathname.startsWith("/account/") && pathname !== "/account")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}