"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText, DollarSign, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { lmsService } from "@/lib/services/lms-service"
import type { LoanApplication } from "@/lib/services/lms-service"

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
      console.log('Loading loan applications...')
      const applications = await lmsService.getLoanApplications()
      console.log('Loaded applications:', applications)
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
    <div className="container mx-auto py-8 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Applications</h1>
          <p className="text-muted-foreground">Manage and track all loan applications</p>
        </div>
        <Link href="/lms/create-application">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}</div>
            <p className="text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.approved}</div>
            <p className="text-xs text-muted-foreground">Ready for disbursement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(loanApplications.reduce((sum, app) => sum + app.loanAmount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total loan amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Applications</CardTitle>
          <CardDescription>Filter and search through loan applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by application ID, customer name, or PAN..."
                className="pl-10"
              />
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

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && loanApplications.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No loan applications found</p>
              <Link href="/lms/create-application">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create First Application
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications Table */}
      {!loading && loanApplications.length > 0 && (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({statusCounts.draft})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            <TabsTrigger value="disbursed">Disbursed ({statusCounts.disbursed})</TabsTrigger>
          </TabsList>
          
          {/* All Applications Tab */}
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.customerName}</p>
                            <p className="text-sm text-muted-foreground">{app.customerPan}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.loanProductName || 'Unknown Product'}</p>
                            <p className="text-sm text-muted-foreground">{app.loanProductId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(app.loanAmount)}</TableCell>
                        <TableCell>{app.tenureMonths} months</TableCell>
                        <TableCell>{formatCurrency(app.collateralValue)}</TableCell>
                        <TableCell>
                          <Badge variant={app.currentLtv > 100 ? "destructive" : "default"}>
                            {app.currentLtv.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            app.status === 'approved' ? 'default' :
                            app.status === 'pending' ? 'secondary' :
                            app.status === 'rejected' ? 'destructive' :
                            'outline'
                          }>
                            {getStatusIcon(app.status)}
                            <span className="ml-1">{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
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
          
          {/* Individual Status Tabs */}
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
                            <TableCell>
                              <div>
                                <p className="font-medium">{app.loanProductName || 'Unknown Product'}</p>
                                <p className="text-sm text-muted-foreground">{app.loanProductId}</p>
                              </div>
                            </TableCell>
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
      )}
    </div>
  )
}