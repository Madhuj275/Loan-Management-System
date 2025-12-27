"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Calculator, Save, Send } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Collateral {
  id: string
  fundName: string
  isin: string
  amcName: string
  folioNumber: string
  unitsPledged: number
  currentNav: number
  currentValue: number
}

const loanProducts = [
  {
    id: "1",
    name: "Equity Mutual Fund Loan",
    minAmount: 100000,
    maxAmount: 10000000,
    interestRate: 10.5,
    ltvRatio: 50,
    minTenure: 6,
    maxTenure: 36,
    processingFeePercentage: 1.5,
  },
  {
    id: "2",
    name: "Debt Mutual Fund Loan",
    minAmount: 50000,
    maxAmount: 5000000,
    interestRate: 9.5,
    ltvRatio: 75,
    minTenure: 3,
    maxTenure: 24,
    processingFeePercentage: 1.0,
  },
  {
    id: "3",
    name: "Hybrid Fund Loan",
    minAmount: 200000,
    maxAmount: 7500000,
    interestRate: 11.0,
    ltvRatio: 60,
    minTenure: 6,
    maxTenure: 30,
    processingFeePercentage: 1.25,
  },
]

export default function CreateLoanApplication() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    pan: "",
    aadhaar: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bankAccountNumber: "",
    bankIfsc: "",
    bankName: "",
  })

  // Loan Details
  const [loanDetails, setLoanDetails] = useState({
    productId: "",
    requestedAmount: "",
    tenureMonths: "",
    purpose: "",
  })

  // Collaterals
  const [collaterals, setCollaterals] = useState<Collateral[]>([])
  const [newCollateral, setNewCollateral] = useState({
    fundName: "",
    isin: "",
    amcName: "",
    folioNumber: "",
    unitsPledged: "",
    currentNav: "",
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateCollateralValue = (collateral: Collateral) => {
    return collateral.unitsPledged * collateral.currentNav
  }

  const getTotalCollateralValue = () => {
    return collaterals.reduce((total, collateral) => total + calculateCollateralValue(collateral), 0)
  }

  const getSelectedProduct = () => {
    return loanProducts.find(product => product.id === loanDetails.productId)
  }

  const getMaxEligibleAmount = () => {
    const product = getSelectedProduct()
    const totalCollateralValue = getTotalCollateralValue()
    if (!product) return 0
    
    const maxByCollateral = (totalCollateralValue * product.ltvRatio) / 100
    const maxByProduct = product.maxAmount
    
    return Math.min(maxByCollateral, maxByProduct)
  }

  const addCollateral = () => {
    if (!newCollateral.fundName || !newCollateral.isin || !newCollateral.amcName || 
        !newCollateral.folioNumber || !newCollateral.unitsPledged || !newCollateral.currentNav) {
      toast({
        title: "Error",
        description: "Please fill all collateral details",
        variant: "destructive",
      })
      return
    }

    const collateral: Collateral = {
      id: Date.now().toString(),
      fundName: newCollateral.fundName,
      isin: newCollateral.isin,
      amcName: newCollateral.amcName,
      folioNumber: newCollateral.folioNumber,
      unitsPledged: parseFloat(newCollateral.unitsPledged),
      currentNav: parseFloat(newCollateral.currentNav),
      currentValue: parseFloat(newCollateral.unitsPledged) * parseFloat(newCollateral.currentNav),
    }

    setCollaterals([...collaterals, collateral])
    setNewCollateral({
      fundName: "",
      isin: "",
      amcName: "",
      folioNumber: "",
      unitsPledged: "",
      currentNav: "",
    })

    toast({
      title: "Success",
      description: "Collateral added successfully",
    })
  }

  const removeCollateral = (id: string) => {
    setCollaterals(collaterals.filter(c => c.id !== id))
  }

  const validateStep1 = () => {
    if (!customerInfo.pan || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Error",
        description: "Please fill all required customer information",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!loanDetails.productId || !loanDetails.requestedAmount || !loanDetails.tenureMonths) {
      toast({
        title: "Error",
        description: "Please fill all loan details",
        variant: "destructive",
      })
      return false
    }

    const product = getSelectedProduct()
    const requestedAmount = parseFloat(loanDetails.requestedAmount)
    
    if (product && (requestedAmount < product.minAmount || requestedAmount > product.maxAmount)) {
      toast({
        title: "Error",
        description: `Loan amount must be between ${formatCurrency(product.minAmount)} and ${formatCurrency(product.maxAmount)}`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const validateStep3 = () => {
    if (collaterals.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one collateral",
        variant: "destructive",
      })
      return false
    }

    const maxEligibleAmount = getMaxEligibleAmount()
    const requestedAmount = parseFloat(loanDetails.requestedAmount)
    
    if (requestedAmount > maxEligibleAmount) {
      toast({
        title: "Error",
        description: `Requested amount exceeds maximum eligible amount of ${formatCurrency(maxEligibleAmount)}`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    } else if (step === 3 && validateStep3()) {
      setStep(4)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const applicationData = {
        customerInfo,
        loanDetails,
        collaterals,
        totalCollateralValue: getTotalCollateralValue(),
        maxEligibleAmount: getMaxEligibleAmount(),
      }

      const response = await fetch('/api/loan-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      if (!response.ok) {
        throw new Error('Failed to create application')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: `Loan application created successfully. Application ID: ${result.applicationNumber}`,
      })

      // Reset form
      setStep(1)
      setCustomerInfo({
        pan: "",
        aadhaar: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        bankAccountNumber: "",
        bankIfsc: "",
        bankName: "",
      })
      setLoanDetails({
        productId: "",
        requestedAmount: "",
        tenureMonths: "",
        purpose: "",
      })
      setCollaterals([])

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create loan application",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Loan Application</h1>
        <p className="text-muted-foreground">
          Submit a new loan application against mutual fund collateral
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Customer Information"}
            {step === 2 && "Loan Details"}
            {step === 3 && "Collateral Information"}
            {step === 4 && "Review & Submit"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Enter customer details and KYC information"}
            {step === 2 && "Select loan product and configure loan terms"}
            {step === 3 && "Add mutual fund units as collateral"}
            {step === 4 && "Review all information before submission"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Customer Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pan">PAN *</Label>
                  <Input
                    id="pan"
                    value={customerInfo.pan}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, pan: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label htmlFor="aadhaar">Aadhaar</Label>
                  <Input
                    id="aadhaar"
                    value={customerInfo.aadhaar}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, aadhaar: e.target.value })}
                    placeholder="1234 5678 9012"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={customerInfo.fullName}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bankAccountNumber">Bank Account</Label>
                  <Input
                    id="bankAccountNumber"
                    value={customerInfo.bankAccountNumber}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, bankAccountNumber: e.target.value })}
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="bankIfsc">IFSC Code</Label>
                  <Input
                    id="bankIfsc"
                    value={customerInfo.bankIfsc}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, bankIfsc: e.target.value.toUpperCase() })}
                    placeholder="HDFC0000123"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={customerInfo.bankName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, bankName: e.target.value })}
                    placeholder="Bank name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Loan Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="productId">Loan Product *</Label>
                <Select value={loanDetails.productId} onValueChange={(value) => setLoanDetails({ ...loanDetails, productId: value })}>
                  <SelectTrigger id="productId">
                    <SelectValue placeholder="Select a loan product" />
                  </SelectTrigger>
                  <SelectContent>
                    {loanProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {product.interestRate}% p.a. (LTV: {product.ltvRatio}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {getSelectedProduct() && (
                <Card className="bg-gray-50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Interest Rate</p>
                        <p className="font-medium">{getSelectedProduct()!.interestRate}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">LTV Ratio</p>
                        <p className="font-medium">{getSelectedProduct()!.ltvRatio}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount Range</p>
                        <p className="font-medium">
                          {formatCurrency(getSelectedProduct()!.minAmount)} - {formatCurrency(getSelectedProduct()!.maxAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tenure Range</p>
                        <p className="font-medium">
                          {getSelectedProduct()!.minTenure} - {getSelectedProduct()!.maxTenure} months
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requestedAmount">Requested Amount *</Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={loanDetails.requestedAmount}
                    onChange={(e) => setLoanDetails({ ...loanDetails, requestedAmount: e.target.value })}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="tenureMonths">Tenure (Months) *</Label>
                  <Input
                    id="tenureMonths"
                    type="number"
                    value={loanDetails.tenureMonths}
                    onChange={(e) => setLoanDetails({ ...loanDetails, tenureMonths: e.target.value })}
                    placeholder="Enter tenure"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Textarea
                  id="purpose"
                  value={loanDetails.purpose}
                  onChange={(e) => setLoanDetails({ ...loanDetails, purpose: e.target.value })}
                  placeholder="Describe the purpose of the loan"
                  rows={3}
                />
              </div>

              {getSelectedProduct() && loanDetails.requestedAmount && (
                <Card className="bg-blue-50">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Loan Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monthly Interest</p>
                        <p className="font-medium">
                          {formatCurrency((parseFloat(loanDetails.requestedAmount) * getSelectedProduct()!.interestRate) / (100 * 12))}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Processing Fee</p>
                        <p className="font-medium">
                          {formatCurrency((parseFloat(loanDetails.requestedAmount) * getSelectedProduct()!.processingFeePercentage) / 100)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Collateral Information */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Collateral</CardTitle>
                  <CardDescription>
                    Add mutual fund units as collateral for the loan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fundName">Fund Name *</Label>
                      <Input
                        id="fundName"
                        value={newCollateral.fundName}
                        onChange={(e) => setNewCollateral({ ...newCollateral, fundName: e.target.value })}
                        placeholder="Enter fund name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="isin">ISIN *</Label>
                      <Input
                        id="isin"
                        value={newCollateral.isin}
                        onChange={(e) => setNewCollateral({ ...newCollateral, isin: e.target.value.toUpperCase() })}
                        placeholder="INE123A12345"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amcName">AMC Name *</Label>
                      <Input
                        id="amcName"
                        value={newCollateral.amcName}
                        onChange={(e) => setNewCollateral({ ...newCollateral, amcName: e.target.value })}
                        placeholder="Enter AMC name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="folioNumber">Folio Number *</Label>
                      <Input
                        id="folioNumber"
                        value={newCollateral.folioNumber}
                        onChange={(e) => setNewCollateral({ ...newCollateral, folioNumber: e.target.value })}
                        placeholder="Enter folio number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unitsPledged">Units Pledged *</Label>
                      <Input
                        id="unitsPledged"
                        type="number"
                        value={newCollateral.unitsPledged}
                        onChange={(e) => setNewCollateral({ ...newCollateral, unitsPledged: e.target.value })}
                        placeholder="Enter units"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentNav">Current NAV *</Label>
                      <Input
                        id="currentNav"
                        type="number"
                        step="0.01"
                        value={newCollateral.currentNav}
                        onChange={(e) => setNewCollateral({ ...newCollateral, currentNav: e.target.value })}
                        placeholder="Enter NAV"
                      />
                    </div>
                  </div>
                  <Button onClick={addCollateral} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Collateral
                  </Button>
                </CardContent>
              </Card>

              {collaterals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Added Collaterals</CardTitle>
                    <CardDescription>
                      Total collateral value: {formatCurrency(getTotalCollateralValue())}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fund Name</TableHead>
                          <TableHead>ISIN</TableHead>
                          <TableHead>AMC</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>NAV</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collaterals.map((collateral) => (
                          <TableRow key={collateral.id}>
                            <TableCell>{collateral.fundName}</TableCell>
                            <TableCell>{collateral.isin}</TableCell>
                            <TableCell>{collateral.amcName}</TableCell>
                            <TableCell>{collateral.unitsPledged.toLocaleString()}</TableCell>
                            <TableCell>{formatCurrency(collateral.currentNav)}</TableCell>
                            <TableCell>{formatCurrency(calculateCollateralValue(collateral))}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCollateral(collateral.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {getSelectedProduct() && getTotalCollateralValue() > 0 && (
                <Card className="bg-green-50">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Eligibility Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Collateral Value</p>
                        <p className="font-medium">{formatCurrency(getTotalCollateralValue())}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">LTV Ratio</p>
                        <p className="font-medium">{getSelectedProduct()!.ltvRatio}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Eligible Amount</p>
                        <p className="font-medium">{formatCurrency(getMaxEligibleAmount())}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Requested Amount</p>
                        <p className="font-medium">
                          {formatCurrency(parseFloat(loanDetails.requestedAmount) || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Summary</CardTitle>
                  <CardDescription>
                    Review all information before submitting the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{customerInfo.fullName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">PAN</p>
                        <p className="font-medium">{customerInfo.pan}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{customerInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{customerInfo.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Loan Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Product</p>
                        <p className="font-medium">{getSelectedProduct()?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{formatCurrency(parseFloat(loanDetails.requestedAmount))}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tenure</p>
                        <p className="font-medium">{loanDetails.tenureMonths} months</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interest Rate</p>
                        <p className="font-medium">{getSelectedProduct()?.interestRate}% p.a.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Collateral Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Collateral Value</span>
                        <span className="font-medium">{formatCurrency(getTotalCollateralValue())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Number of Funds</span>
                        <span className="font-medium">{collaterals.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">LTV Ratio</span>
                        <span className="font-medium">{((parseFloat(loanDetails.requestedAmount) / getTotalCollateralValue()) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}