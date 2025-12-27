import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Eye, Search, Filter, Download, Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

// Mock data for collaterals
const collaterals = [
  {
    id: "COLL20241227001",
    loanId: "LOAN20241227001",
    customerName: "Rajesh Kumar",
    customerPan: "ABCDE1234F",
    fundName: "HDFC Index Fund - Sensex Plan",
    isin: "INF179K01TS5",
    amcName: "HDFC Asset Management Company",
    folioNumber: "1234567890",
    unitsPledged: 1000,
    currentNav: 150.25,
    currentValue: 150250,
    lienStatus: "marked",
    lienMarkedAt: "2024-12-27",
    lienReference: "CAMS/LIEN/2024/12345",
    lastUpdated: "2024-12-27",
  },
  {
    id: "COLL20241227002",
    loanId: "LOAN20241227001",
    customerName: "Rajesh Kumar",
    customerPan: "ABCDE1234F",
    fundName: "ICICI Prudential Equity Fund",
    isin: "INF109K01VS2",
    amcName: "ICICI Prudential Asset Management",
    folioNumber: "0987654321",
    unitsPledged: 2000,
    currentNav: 100.75,
    currentValue: 201500,
    lienStatus: "marked",
    lienMarkedAt: "2024-12-27",
    lienReference: "CAMS/LIEN/2024/12346",
    lastUpdated: "2024-12-27",
  },
  {
    id: "COLL20241225003",
    loanId: "LOAN20241225002",
    customerName: "Priya Sharma",
    customerPan: "FGHIJ5678K",
    fundName: "SBI Debt Fund - Regular Plan",
    isin: "INF200K01BT8",
    amcName: "SBI Funds Management",
    folioNumber: "1122334455",
    unitsPledged: 5000,
    currentNav: 50.15,
    currentValue: 250750,
    lienStatus: "marked",
    lienMarkedAt: "2024-12-25",
    lienReference: "CAMS/LIEN/2024/12347",
    lastUpdated: "2024-12-27",
  },
  {
    id: "COLL20241220004",
    loanId: "LOAN20241220003",
    customerName: "Amit Patel",
    customerPan: "LMNOP9012Q",
    fundName: "Mirae Asset Hybrid Fund",
    isin: "INF769K01MS3",
    amcName: "Mirae Asset Investment Managers",
    folioNumber: "5566778899",
    unitsPledged: 3000,
    currentNav: 120.80,
    currentValue: 362400,
    lienStatus: "pending",
    lienMarkedAt: null,
    lienReference: null,
    lastUpdated: "2024-12-20",
  },
  {
    id: "COLL20241215005",
    loanId: "LOAN20241215004",
    customerName: "Sunita Verma",
    customerPan: "QRSTU3456V",
    fundName: "Nippon India Growth Fund",
    isin: "INF204K01LC1",
    amcName: "Nippon Life India Asset Management",
    folioNumber: "9988776655",
    unitsPledged: 4000,
    currentNav: 200.45,
    currentValue: 801800,
    lienStatus: "marked",
    lienMarkedAt: "2024-12-15",
    lienReference: "CAMS/LIEN/2024/12348",
    lastUpdated: "2024-12-27",
  },
]

const getLienStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
    case "marked":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Marked</Badge>
    case "released":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Released</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getLienStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "marked":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "released":
      return <Shield className="h-4 w-4 text-gray-600" />
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

const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-IN').format(number)
}

export default function CollateralManagementPage() {
  const statusCounts = {
    all: collaterals.length,
    marked: collaterals.filter(c => c.lienStatus === "marked").length,
    pending: collaterals.filter(c => c.lienStatus === "pending").length,
    released: collaterals.filter(c => c.lienStatus === "released").length,
  }

  const totalCollateralValue = collaterals.reduce((sum, collateral) => sum + collateral.currentValue, 0)
  const avgNav = totalCollateralValue / collaterals.reduce((sum, collateral) => sum + collateral.unitsPledged, 0)

  // Group by AMC
  const amcSummary = collaterals.reduce((acc, collateral) => {
    if (!acc[collateral.amcName]) {
      acc[collateral.amcName] = {
        count: 0,
        totalValue: 0,
        units: 0,
      }
    }
    acc[collateral.amcName].count += 1
    acc[collateral.amcName].totalValue += collateral.currentValue
    acc[collateral.amcName].units += collateral.unitsPledged
    return acc
  }, {} as Record<string, { count: number; totalValue: number; units: number }>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collateral Management</h1>
          <p className="text-muted-foreground">
            Track and manage mutual fund collaterals pledged against loans
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collateral Value</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCollateralValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {collaterals.length} collaterals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marked Liens</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.marked}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully marked with RTAs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Liens</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statusCounts.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting lien marking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average NAV</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(150.25)}
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted average NAV
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by fund name, ISIN, customer, or folio..."
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
                  <SelectItem value="marked">Marked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by AMC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All AMCs</SelectItem>
                  <SelectItem value="HDFC Asset Management Company">HDFC</SelectItem>
                  <SelectItem value="ICICI Prudential Asset Management">ICICI Prudential</SelectItem>
                  <SelectItem value="SBI Funds Management">SBI</SelectItem>
                  <SelectItem value="Mirae Asset Investment Managers">Mirae Asset</SelectItem>
                  <SelectItem value="Nippon Life India Asset Management">Nippon India</SelectItem>
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

      {/* Collaterals Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="marked">Marked ({statusCounts.marked})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="released">Released ({statusCounts.released})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Collaterals</CardTitle>
              <CardDescription>
                Complete list of all pledged mutual fund units
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collateral ID</TableHead>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Fund Name</TableHead>
                    <TableHead>ISIN</TableHead>
                    <TableHead>AMC</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>NAV</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Lien Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaterals.map((collateral) => (
                    <TableRow key={collateral.id}>
                      <TableCell className="font-medium">{collateral.id}</TableCell>
                      <TableCell>{collateral.loanId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{collateral.customerName}</p>
                          <p className="text-sm text-muted-foreground">{collateral.customerPan}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{collateral.fundName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{collateral.isin}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate">{collateral.amcName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(collateral.unitsPledged)}</TableCell>
                      <TableCell>{formatCurrency(collateral.currentNav)}</TableCell>
                      <TableCell>{formatCurrency(collateral.currentValue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getLienStatusIcon(collateral.lienStatus)}
                          {getLienStatusBadge(collateral.lienStatus)}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(collateral.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/lms/collaterals/${collateral.id}`}>
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

        {/* Status-specific tabs */}
        {Object.keys(statusCounts).filter(key => key !== 'all').map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getLienStatusIcon(status)}
                  <span>{status.charAt(0).toUpperCase() + status.slice(1)} Collaterals</span>
                </CardTitle>
                <CardDescription>
                  Collaterals with {status} lien status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Collateral ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Fund Name</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>NAV</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Lien Reference</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaterals
                      .filter(c => c.lienStatus === status)
                      .map((collateral) => (
                        <TableRow key={collateral.id}>
                          <TableCell className="font-medium">{collateral.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{collateral.customerName}</p>
                              <p className="text-sm text-muted-foreground">{collateral.customerPan}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium truncate">{collateral.fundName}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatNumber(collateral.unitsPledged)}</TableCell>
                          <TableCell>{formatCurrency(collateral.currentNav)}</TableCell>
                          <TableCell>{formatCurrency(collateral.currentValue)}</TableCell>
                          <TableCell>
                            {collateral.lienReference ? (
                              <span className="font-mono text-sm">{collateral.lienReference}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={`/lms/collaterals/${collateral.id}`}>
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
        ))}
      </Tabs>

      {/* AMC Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AMC Summary</CardTitle>
            <CardDescription>
              Collateral distribution by Asset Management Company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(amcSummary).map(([amcName, summary]) => (
              <div key={amcName} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{amcName}</span>
                  <Badge variant="outline">{summary.count}</Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatNumber(summary.units)} units</span>
                  <span>{formatCurrency(summary.totalValue)}</span>
                </div>
                <Progress 
                  value={(summary.totalValue / totalCollateralValue) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lien Status Distribution</CardTitle>
            <CardDescription>
              Current status of all pledged collaterals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Marked</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {statusCounts.marked}
                </Badge>
              </div>
              <Progress value={(statusCounts.marked / collaterals.length) * 100} className="h-2 bg-green-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {statusCounts.pending}
                </Badge>
              </div>
              <Progress value={(statusCounts.pending / collaterals.length) * 100} className="h-2 bg-yellow-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Released</span>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  {statusCounts.released}
                </Badge>
              </div>
              <Progress value={(statusCounts.released / collaterals.length) * 100} className="h-2 bg-gray-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common collateral management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Update NAV Values
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Process Margin Calls
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Release Liens
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify Lien Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}