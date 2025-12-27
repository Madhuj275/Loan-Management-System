import { NextResponse, NextRequest } from "next/server"

// Mock loan applications data
const mockLoanApplications = [
  {
    application: {
      id: "1",
      customerId: "1",
      productId: "1",
      loanAmount: 500000,
      tenureMonths: 12,
      interestRate: 10.5,
      ltvRatio: 50,
      collateralValue: 1000000,
      status: "approved",
      monthlyIncome: 75000,
      employmentType: "salaried",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20")
    },
    customer: {
      id: "1",
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91-9876543210",
      pan: "ABCDE1234F",
      dateOfBirth: new Date("1985-06-15"),
      address: "123, MG Road, Mumbai",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10")
    },
    product: {
      id: "1",
      name: "Equity Mutual Fund Loan",
      description: "Loan against equity mutual funds with competitive rates",
      minAmount: 100000,
      maxAmount: 5000000,
      interestRate: 10.5,
      ltvRatio: 50,
      minTenureMonths: 6,
      maxTenureMonths: 36,
      processingFeePercentage: 1.5,
      isActive: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15")
    }
  },
  {
    application: {
      id: "2",
      customerId: "2",
      productId: "2",
      loanAmount: 750000,
      tenureMonths: 24,
      interestRate: 9.0,
      ltvRatio: 70,
      collateralValue: 1071429,
      status: "pending",
      monthlyIncome: 100000,
      employmentType: "self_employed",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20")
    },
    customer: {
      id: "2",
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@email.com",
      phone: "+91-9123456789",
      pan: "FGHIJ5678K",
      dateOfBirth: new Date("1982-03-22"),
      address: "456, SV Road, Pune",
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-18")
    },
    product: {
      id: "2",
      name: "Debt Mutual Fund Loan",
      description: "Loan against debt mutual funds with lower interest rates",
      minAmount: 50000,
      maxAmount: 2000000,
      interestRate: 9.0,
      ltvRatio: 70,
      minTenureMonths: 3,
      maxTenureMonths: 24,
      processingFeePercentage: 1.0,
      isActive: true,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20")
    }
  }
]

// GET all loan applications
export async function GET() {
  try {
    return NextResponse.json(mockLoanApplications)
  } catch (error) {
    console.error("Failed to fetch loan applications:", error)
    return NextResponse.json({ error: "Failed to fetch loan applications" }, { status: 500 })
  }
}

// POST create new loan application
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Mock application creation
    const newApplication = {
      application: {
        id: String(mockLoanApplications.length + 1),
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      customer: {
        id: String(mockLoanApplications.length + 1),
        firstName: "New",
        lastName: "Customer",
        email: "new.customer@email.com",
        phone: "+91-9999999999",
        pan: "NEW1234567",
        dateOfBirth: new Date("1990-01-01"),
        address: "New Address",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      product: {
        id: body.productId,
        name: "Selected Product",
        description: "Product description",
        minAmount: 100000,
        maxAmount: 5000000,
        interestRate: 10.0,
        ltvRatio: 60,
        minTenureMonths: 6,
        maxTenureMonths: 36,
        processingFeePercentage: 1.5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    
    return NextResponse.json(newApplication, { status: 201 })
  } catch (error) {
    console.error("Failed to create loan application:", error)
    return NextResponse.json({ error: "Failed to create loan application" }, { status: 500 })
  }
}