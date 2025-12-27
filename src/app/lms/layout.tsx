import { Inter } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, CreditCard, FileText, DollarSign, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export default function LMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: "/lms", label: "Dashboard", icon: Home },
    { href: "/lms/loan-products", label: "Loan Products", icon: CreditCard },
    { href: "/lms/applications", label: "Applications", icon: FileText },
    { href: "/lms/ongoing-loans", label: "Ongoing Loans", icon: DollarSign },
    { href: "/lms/collaterals", label: "Collaterals", icon: Shield },
    { href: "/lms/create-application", label: "New Application", icon: TrendingUp },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
          <div className="hidden md:flex w-64 bg-white shadow-lg">
            <div className="flex flex-col w-full">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">LMS - NBFC</h1>
                <p className="text-sm text-gray-600">Loan Against Mutual Funds</p>
              </div>
              <nav className="flex-1 px-4">
                <div className="flex flex-col space-y-2 w-full">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800">LMS - NBFC</h1>
                  <p className="text-sm text-gray-600">Loan Against Mutual Funds</p>
                </div>
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button variant="ghost" className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
  )
}