import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

async function ensureLoanProductsExist() {
  const existingProducts = await prisma.loanProduct.count()
  
  if (existingProducts === 0) {
    const loanProducts = [
      {
        name: "Equity Mutual Fund Loan",
        description: "Loan against equity mutual funds with competitive rates",
        minAmount: 100000,
        maxAmount: 10000000,
        interestRate: 10.5,
        ltvRatio: 50,
        minTenureMonths: 6,
        maxTenureMonths: 36,
        processingFeePercentage: 1.5,
        isActive: true,
      },
      {
        name: "Debt Mutual Fund Loan", 
        description: "Loan against debt mutual funds with lower interest rates",
        minAmount: 50000,
        maxAmount: 5000000,
        interestRate: 9.5,
        ltvRatio: 75,
        minTenureMonths: 3,
        maxTenureMonths: 24,
        processingFeePercentage: 1.0,
        isActive: true,
      },
      {
        name: "Hybrid Fund Loan",
        description: "Loan against hybrid mutual funds with balanced risk",
        minAmount: 200000,
        maxAmount: 7500000,
        interestRate: 11.0,
        ltvRatio: 60,
        minTenureMonths: 6,
        maxTenureMonths: 30,
        processingFeePercentage: 1.25,
        isActive: true,
      }
    ]

    for (const product of loanProducts) {
      await prisma.loanProduct.create({ data: product })
    }
  }
}

// GET all loan products
export async function GET() {
  try {
    // Ensure loan products exist
    await ensureLoanProductsExist()
    
    const products = await prisma.loanProduct.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Convert Decimal fields to numbers for proper JSON serialization
    const serializedProducts = products.map(product => ({
      ...product,
      minAmount: Number(product.minAmount),
      maxAmount: Number(product.maxAmount),
      interestRate: Number(product.interestRate),
      ltvRatio: Number(product.ltvRatio),
      processingFeePercentage: Number(product.processingFeePercentage),
    }))
    
    return NextResponse.json(serializedProducts)
  } catch (error) {
    console.error("Failed to fetch loan products:", error)
    return NextResponse.json({ error: "Failed to fetch loan products" }, { status: 500 })
  }
}

// POST create new loan product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = await prisma.loanProduct.create({
      data: {
        ...body,
        updatedAt: new Date(),
      }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Failed to create loan product:", error)
    return NextResponse.json({ error: "Failed to create loan product" }, { status: 500 })
  }
}