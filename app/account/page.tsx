import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountDashboard } from "@/components/account-dashboard"

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AccountDashboard />
      </main>
      <Footer />
    </div>
  )
}
