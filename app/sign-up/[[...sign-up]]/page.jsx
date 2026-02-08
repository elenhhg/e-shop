import { SignUp } from "@clerk/nextjs"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"

export default function SignUpPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignUp 
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/account"
          />
        </div>
      </main>
      <PremiumFooter />
    </>
  )
}