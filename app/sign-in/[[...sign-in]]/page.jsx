import { SignIn } from "@clerk/nextjs"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"

export default function SignInPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignIn 
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/account"
          />
        </div>
      </main>
      <PremiumFooter />
    </>
  )
}