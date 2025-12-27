"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye, Filter, Search, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { lmsService, LoanApplication } from "@/lib/services/lms-service"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Draft</Badge>
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
    case "approved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
    case "disbursed":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Disbursed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
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

export default function LoanApplicationsPage() {
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadLoanApplications()
  }, [])

  const loadLoanApplications = async () => {
    try {
      setLoading(true)
      const applications = await lmsService.getLoanApplications()
      setLoanApplications(applications)
    } catch (error) {
      console.error('Failed to load loan applications:', error)
      toast({
        title: 'Error',
        description: 'Failed to load loan applications',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const statusCounts = {
    all: loanApplications.length,
    draft: loanApplications.filter(app => app.status === "draft").length,
    pending: loanApplications.filter(app => app.status === "pending").length,
    approved: loanApplications.filter(app => app.status === "approved").length,
    rejected: loanApplications.filter(app => app.status === "rejected").length,
    disbursed: loanApplications.filter(app => app.status === "disbursed").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Applications</h1>
          <p className="text-muted-foreground">
            Track and manage all loan applications
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/lms/create-application">
            <Button className="bg-blue-600 hover:bg-blue-700">
              New Application
            </Button>
          </Link>
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
                  placeholder="Search by application ID, customer name, or PAN..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
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

      {/* Applications Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({statusCounts.draft})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
          <TabsTrigger value="disbursed">Disbursed ({statusCounts.disbursed})</TabsTrigger>
        </TabsList>
        
        {Object.keys(statusCounts).filter(key => key !== 'all').map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span>{status.charAt(0).toUpperCase() + status.slice(1)} Applications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tenure</TableHead>
                      <TableHead>Collateral Value</TableHead>
                      <TableHead>LTV</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanApplications
                      .filter(app => app.status === status)
                      .map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{app.customerName}</p>
                              <p className="text-sm text-muted-foreground">{app.customerPan}</p>
                            </div>
                          </TableCell>
                          <TableCell>{app.loanProductId}</TableCell>
                          <TableCell>{formatCurrency(app.loanAmount)}</TableCell>
                          <TableCell>{app.tenureMonths} months</TableCell>
                          <TableCell>{formatCurrency(app.collateralValue)}</TableCell>
                          <TableCell>
                            <Badge variant={app.currentLtv > 100 ? "destructive" : "default"}>
                              {app.currentLtv.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={`/lms/applications/${app.id}`}>
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
    </div>
  )
}