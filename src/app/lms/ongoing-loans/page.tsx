import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye, Search, Filter, Download, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock data for ongoing loans
const ongoingLoans = [
  {
    id: "LOAN20241227001",
    customerName: "Rajesh Kumar",
    customerPan: "ABCDE1234F",
    loanAmount: 500000,
    outstandingPrincipal: 480000,
    outstandingInterest: 5250,
    interestRate: 10.5,
    tenureMonths: 24,
    monthsRemaining: 22,
    disbursedDate: "2024-12-27",
    maturityDate: "2026-12-27",
    status: "active",
    collateralValue: 700000,
    currentLtv: 68.6,
    lastPaymentDate: "2024-12-27",
    emiAmount: 23125,
  },
  {
    id: "LOAN20241225002",
    customerName: "Priya Sharma",
    customerPan: "FGHIJ5678K",
    loanAmount: 350000,
    outstandingPrincipal: 340000,
    outstandingInterest: 2770,
    interestRate: 9.5,
    tenureMonths: 18,
    monthsRemaining: 17,
    disbursedDate: "2024-12-25",
    maturityDate: "2026-06-25",
    status: "active",
    collateralValue: 500000,
    currentLtv: 70.0,
    lastPaymentDate: "2024-12-25",
    emiAmount: 20138,
  },
  {
    id: "LOAN20241220003",
    customerName: "Amit Patel",
    customerPan: "LMNOP9012Q",
    loanAmount: 725000,
    outstandingPrincipal: 710000,
    outstandingInterest: 6041,
    interestRate: 10.0,
    tenureMonths: 30,
    monthsRemaining: 28,
    disbursedDate: "2024-12-20",
    maturityDate: "2027-06-20",
    status: "margin_call",
    collateralValue: 650000,
    currentLtv: 111.5,
    lastPaymentDate: "2024-12-20",
    emiAmount: 25833,
  },
  {
    id: "LOAN20241215004",
    customerName: "Sunita Verma",
    customerPan: "QRSTU3456V",
    loanAmount: 800000,
    outstandingPrincipal: 750000,
    outstandingInterest: 6666,
    interestRate: 10.0,
    tenureMonths: 36,
    monthsRemaining: 33,
    disbursedDate: "2024-12-15",
    maturityDate: "2027-12-15",
    status: "active",
    collateralValue: 1200000,
    currentLtv: 66.7,
    lastPaymentDate: "2024-12-15",
    emiAmount: 22222,
  },
]

const closedLoans = [
  {
    id: "LOAN20241101001",
    customerName: "Vikas Singh",
    customerPan: "WXYZA7890B",
    loanAmount: 200000,
    outstandingPrincipal: 0,
    outstandingInterest: 0,
    interestRate: 9.5,
    tenureMonths: 12,
    monthsRemaining: 0,
    disbursedDate: "2024-11-01",
    maturityDate: "2024-12-01",
    status: "closed",
    collateralValue: 0,
    currentLtv: 0,
    lastPaymentDate: "2024-12-01",
    emiAmount: 17500,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
    case "margin_call":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Margin Call</Badge>
    case "closed":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Closed</Badge>
    case "defaulted":
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Defaulted</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "margin_call":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return null
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const calculateProgress = (monthsRemaining: number, tenureMonths: number) => {
  return ((tenureMonths - monthsRemaining) / tenureMonths) * 100
}

export default function OngoingLoansPage() {
  const statusCounts = {
    all: ongoingLoans.length + closedLoans.length,
    active: ongoingLoans.filter(loan => loan.status === "active").length,
    margin_call: ongoingLoans.filter(loan => loan.status === "margin_call").length,
    closed: closedLoans.length,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ongoing Loans</h1>
          <p className="text-muted-foreground">
            Manage and monitor all active loans
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by loan ID, customer name, or PAN..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="margin_call">Margin Call</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({statusCounts.active})</TabsTrigger>
          <TabsTrigger value="margin_call">Margin Calls ({statusCounts.margin_call})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({statusCounts.closed})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon("active")}
                <span>Active Loans</span>
              </CardTitle>
              <CardDescription>
                Loans that are currently active and performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Collateral Value</TableHead>
                    <TableHead>LTV</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ongoingLoans
                    .filter(loan => loan.status === "active")
                    .map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{loan.customerName}</p>
                            <p className="text-sm text-muted-foreground">{loan.customerPan}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatCurrency(loan.outstandingPrincipal)}</p>
                            <p className="text-sm text-muted-foreground">+ {formatCurrency(loan.outstandingInterest)} interest</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={calculateProgress(loan.monthsRemaining, loan.tenureMonths)} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {loan.monthsRemaining} months remaining
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(loan.collateralValue)}</TableCell>
                        <TableCell>
                          <Badge variant={loan.currentLtv > 100 ? "destructive" : "default"}>
                            {loan.currentLtv.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/lms/loans/${loan.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="margin_call" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon("margin_call")}
                <span>Margin Calls</span>
              </CardTitle>
              <CardDescription>
                Loans requiring immediate attention due to collateral shortfall
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Collateral Value</TableHead>
                    <TableHead>Current LTV</TableHead>
                    <TableHead>Required LTV</TableHead>
                    <TableHead>Shortfall</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ongoingLoans
                    .filter(loan => loan.status === "margin_call")
                    .map((loan) => {
                      const requiredCollateral = (loan.outstandingPrincipal * 100) / 75 // Assuming 75% max LTV
                      const shortfall = requiredCollateral - loan.collateralValue
                      
                      return (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{loan.customerName}</p>
                              <p className="text-sm text-muted-foreground">{loan.customerPan}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                          <TableCell>{formatCurrency(loan.outstandingPrincipal)}</TableCell>
                          <TableCell>{formatCurrency(loan.collateralValue)}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              {loan.currentLtv.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>75%</TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              {formatCurrency(shortfall)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={`/lms/loans/${loan.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                Action
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Closed Loans</CardTitle>
              <CardDescription>
                Successfully completed loan accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Disbursed Date</TableHead>
                    <TableHead>Closure Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{loan.customerName}</p>
                          <p className="text-sm text-muted-foreground">{loan.customerPan}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                      <TableCell>{new Date(loan.disbursedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(loan.maturityDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/lms/loans/${loan.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(ongoingLoans.reduce((sum, loan) => sum + loan.outstandingPrincipal, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {ongoingLoans.length} active loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collateral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(ongoingLoans.reduce((sum, loan) => sum + loan.collateralValue, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Current market value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margin Calls</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.margin_call}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg LTV Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(ongoingLoans.reduce((sum, loan) => sum + loan.currentLtv, 0) / ongoingLoans.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all active loans
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}