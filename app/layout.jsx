import { Inter, Cormorant_Garamond } from "next/font/google"
import { CartProvider } from "@/components/cart-provider"
import { LoadingScreen } from "@/components/loading"
import "./globals.css"
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata = {
  title: "HAVEN",
  description: "Discover timeless elegance with our curated collection of premium fashion pieces.",
}

export default function RootLayout({ children }) {
  return (
      <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
        <body className="font-sans antialiased bg-amber-900/10 min-h-screen">
          <CartProvider>
            <LoadingScreen />
          <ClerkProvider>
            {children}
          </ClerkProvider>
        </CartProvider>
      </body>
    </html>
  )
}
