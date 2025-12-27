import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, FileText, Shield, Users, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function LMSDashboard() {
  const stats = [
    {
      title: "Total Applications",
      value: "156",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Loans",
      value: "89",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Collateral Value",
      value: "₹2.4 Cr",
      change: "+5%",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Approvals",
      value: "23",
      change: "-3%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentApplications = [
    {
      id: "LAMF20241227001",
      customer: "Rajesh Kumar",
      amount: "₹5,00,000",
      status: "pending",
      date: "2024-12-27",
    },
    {
      id: "LAMF20241226002",
      customer: "Priya Sharma",
      amount: "₹3,50,000",
      status: "approved",
      date: "2024-12-26",
    },
    {
      id: "LAMF20241225003",
      customer: "Amit Patel",
      amount: "₹7,25,000",
      status: "rejected",
      date: "2024-12-25",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LMS Dashboard</h1>
          <p className="text-muted-foreground">
            Loan Management System for Lending Against Mutual Funds
          </p>
        </div>
        <Link href="/lms/create-application">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Applications */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest loan applications submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {app.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {app.customer}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{app.amount}</span>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/lms/loan-products">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Loan Products
              </Button>
            </Link>
            <Link href="/lms/collaterals">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                View Collaterals
              </Button>
            </Link>
            <Link href="/lms/ongoing-loans">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Active Loans
              </Button>
            </Link>
            <Link href="/lms/applications">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Review Applications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Average Loan Amount</h4>
              <p className="text-2xl font-bold">₹4,25,000</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Approval Rate</h4>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Average Processing Time</h4>
              <p className="text-2xl font-bold">3.2 days</p>
              <p className="text-xs text-muted-foreground">From application to approval</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}