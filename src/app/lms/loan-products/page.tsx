"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, X } from "lucide-react"
import Link from "next/link"
import { lmsService, LoanProduct } from "@/lib/services/lms-service"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoanProductsPage() {
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minAmount: '',
    maxAmount: '',
    interestRate: '',
    ltvRatio: '',
    minTenureMonths: '',
    maxTenureMonths: '',
    processingFeePercentage: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    loadLoanProducts()
  }, [])

  const loadLoanProducts = async () => {
    try {
      setLoading(true)
      const products = await lmsService.getLoanProducts()
      setLoanProducts(products)
    } catch (error) {
      console.error('Failed to load loan products:', error)
      toast({
        title: 'Error',
        description: 'Failed to load loan products',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddProduct = async () => {
    try {
      const newProduct = await lmsService.createLoanProduct({
        name: formData.name,
        description: formData.description,
        minAmount: parseFloat(formData.minAmount),
        maxAmount: parseFloat(formData.maxAmount),
        interestRate: parseFloat(formData.interestRate),
        ltvRatio: parseFloat(formData.ltvRatio),
        minTenureMonths: parseInt(formData.minTenureMonths),
        maxTenureMonths: parseInt(formData.maxTenureMonths),
        processingFeePercentage: parseFloat(formData.processingFeePercentage),
        isActive: true,
      })
      
      setLoanProducts([...loanProducts, newProduct])
      setShowAddModal(false)
      setFormData({
        name: '',
        description: '',
        minAmount: '',
        maxAmount: '',
        interestRate: '',
        ltvRatio: '',
        minTenureMonths: '',
        maxTenureMonths: '',
        processingFeePercentage: '',
      })
      
      toast({
        title: 'Success',
        description: 'Loan product created successfully',
      })
    } catch (error) {
      console.error('Failed to create loan product:', error)
      toast({
        title: 'Error',
        description: 'Failed to create loan product',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Products</h1>
          <p className="text-muted-foreground">
            Manage loan products for lending against mutual funds
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
          <CardDescription>
            Configure loan products with different terms and conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground">Loading loan products...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>LTV Ratio</TableHead>
                  <TableHead>Amount Range</TableHead>
                  <TableHead>Tenure</TableHead>
                  <TableHead>Processing Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.interestRate}% p.a.</TableCell>
                    <TableCell>{product.ltvRatio}%</TableCell>
                    <TableCell>
                      {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                    </TableCell>
                    <TableCell>
                      {product.minTenureMonths} - {product.maxTenureMonths} months
                    </TableCell>
                    <TableCell>{product.processingFeePercentage}%</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Product Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">Equity Funds</h4>
              <p className="text-sm text-muted-foreground">LTV up to 50%, Interest rate 10-12%</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Debt Funds</h4>
              <p className="text-sm text-muted-foreground">LTV up to 75%, Interest rate 9-11%</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Hybrid Funds</h4>
              <p className="text-sm text-muted-foreground">LTV up to 60%, Interest rate 10.5-12.5%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">Market Risk</h4>
              <p className="text-sm text-muted-foreground">Daily NAV monitoring required</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Concentration Risk</h4>
              <p className="text-sm text-muted-foreground">Maximum 25% single fund exposure</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Liquidity Risk</h4>
              <p className="text-sm text-muted-foreground">Exit load considerations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">RBI Guidelines</h4>
              <p className="text-sm text-muted-foreground">LAMF circular compliance</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">SEBI Regulations</h4>
              <p className="text-sm text-muted-foreground">Mutual fund pledge norms</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">KYC Requirements</h4>
              <p className="text-sm text-muted-foreground">Enhanced due diligence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Loan Product</DialogTitle>
            <DialogDescription>
              Create a new loan product for lending against mutual funds
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Equity Mutual Fund Loan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Amount (₹)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                  placeholder="100000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Amount (₹)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) => setFormData({...formData, maxAmount: e.target.value})}
                  placeholder="10000000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                  placeholder="10.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ltvRatio">Maximum LTV Ratio (%)</Label>
                <Input
                  id="ltvRatio"
                  type="number"
                  value={formData.ltvRatio}
                  onChange={(e) => setFormData({...formData, ltvRatio: e.target.value})}
                  placeholder="50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minTenureMonths">Minimum Tenure (months)</Label>
                <Input
                  id="minTenureMonths"
                  type="number"
                  value={formData.minTenureMonths}
                  onChange={(e) => setFormData({...formData, minTenureMonths: e.target.value})}
                  placeholder="6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTenureMonths">Maximum Tenure (months)</Label>
                <Input
                  id="maxTenureMonths"
                  type="number"
                  value={formData.maxTenureMonths}
                  onChange={(e) => setFormData({...formData, maxTenureMonths: e.target.value})}
                  placeholder="60"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="processingFeePercentage">Processing Fee (%)</Label>
              <Input
                id="processingFeePercentage"
                type="number"
                step="0.1"
                value={formData.processingFeePercentage}
                onChange={(e) => setFormData({...formData, processingFeePercentage: e.target.value})}
                placeholder="1.5"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}