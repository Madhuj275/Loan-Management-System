import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all loan applications
export async function GET() {
  try {
    const applications = await prisma.loanApplication.findMany({
      include: {
        customer: true,
        product: true,
        collaterals: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match what the frontend expects
    const transformedApplications = applications.map(app => ({
      id: app.id,
      applicationNumber: app.applicationNumber,
      customerName: app.customer.fullName,
      customerPan: app.customer.pan,
      customerEmail: app.customer.email,
      customerPhone: app.customer.phone,
      loanAmount: Number(app.requestedAmount),
      interestRate: Number(app.product.interestRate),
      tenureMonths: app.tenureMonths,
      loanProductId: app.productId,
      loanProductName: app.product.name,
      status: app.status,
      collateralValue: app.collaterals.reduce((sum, collateral) => sum + Number(collateral.currentValue), 0),
      currentLtv: app.collaterals.reduce((sum, collateral) => sum + Number(collateral.currentValue), 0) > 0 
        ? (Number(app.requestedAmount) / app.collaterals.reduce((sum, collateral) => sum + Number(collateral.currentValue), 0)) * 100 
        : 0,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }))

    return NextResponse.json(transformedApplications)
  } catch (error) {
    console.error("Failed to fetch loan applications:", error)
    return NextResponse.json({ error: "Failed to fetch loan applications" }, { status: 500 })
  }
}

// POST create new loan application
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required data
    if (!body.customerInfo || !body.loanDetails || !body.collaterals) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }
    
    // Generate application number
    const applicationNumber = `APP${Date.now().toString().slice(-8)}`
    
    // First, find or create the customer
    let customer = await prisma.customer.findUnique({
      where: { pan: body.customerInfo.pan }
    })

    if (!customer) {
      // Check if email is already taken by another customer
      const existingEmailCustomer = await prisma.customer.findUnique({
        where: { email: body.customerInfo.email }
      })

      if (existingEmailCustomer) {
        // If email exists but different PAN, we need to handle this case
        // For now, we'll use the existing customer with that email
        customer = existingEmailCustomer
        // Update the PAN if it's different (though this shouldn't happen in practice)
        if (existingEmailCustomer.pan !== body.customerInfo.pan) {
          // This is a business logic decision - you might want to reject or handle differently
          console.warn(`Email ${body.customerInfo.email} already exists with different PAN: ${existingEmailCustomer.pan} vs ${body.customerInfo.pan}`)
        }
      } else {
        // Create new customer
        customer = await prisma.customer.create({
          data: {
            pan: body.customerInfo.pan,
            aadhaar: body.customerInfo.aadhaar || null,
            fullName: body.customerInfo.fullName,
            email: body.customerInfo.email,
            phone: body.customerInfo.phone,
            address: body.customerInfo.address || null,
            bankAccountNumber: body.customerInfo.bankAccountNumber || null,
            bankIfsc: body.customerInfo.bankIfsc || null,
            bankName: body.customerInfo.bankName || null,
          }
        })
      }
    } else {
      // Customer exists with this PAN, verify email matches
      if (customer.email !== body.customerInfo.email) {
        console.warn(`Customer with PAN ${body.customerInfo.pan} has different email: ${customer.email} vs ${body.customerInfo.email}`)
        // Update customer email to match the new application
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { 
            email: body.customerInfo.email,
            fullName: body.customerInfo.fullName,
            phone: body.customerInfo.phone,
            address: body.customerInfo.address || null,
            bankAccountNumber: body.customerInfo.bankAccountNumber || null,
            bankIfsc: body.customerInfo.bankIfsc || null,
            bankName: body.customerInfo.bankName || null,
          }
        })
      }
    }

    // Get the selected product
    const product = await prisma.loanProduct.findUnique({
      where: { id: body.loanDetails.productId }
    })

    if (!product) {
      return NextResponse.json({ error: "Invalid loan product" }, { status: 400 })
    }

    // Calculate total collateral value
    const totalCollateralValue = body.collaterals.reduce((sum: number, collateral: any) => {
      const units = parseFloat(collateral.unitsPledged) || 0
      const nav = parseFloat(collateral.currentNav) || 0
      return sum + (units * nav)
    }, 0)

    // Create the loan application
    const application = await prisma.loanApplication.create({
      data: {
        applicationNumber,
        customerId: customer.id,
        productId: product.id,
        requestedAmount: parseFloat(body.loanDetails.requestedAmount) || 0,
        tenureMonths: parseInt(body.loanDetails.tenureMonths) || 0,
        status: 'pending',
        appliedAt: new Date(),
        collaterals: {
          create: body.collaterals.map((collateral: any) => ({
            fundName: collateral.fundName,
            isin: collateral.isin,
            amcName: collateral.amcName,
            folioNumber: collateral.folioNumber,
            unitsPledged: parseFloat(collateral.unitsPledged) || 0,
            currentNav: parseFloat(collateral.currentNav) || 0,
            currentValue: (parseFloat(collateral.unitsPledged) || 0) * (parseFloat(collateral.currentNav) || 0),
          }))
        }
      },
      include: {
        customer: true,
        product: true,
        collaterals: true,
      }
    })

    // Transform the response to match frontend expectations
    const transformedApplication = {
      id: application.id,
      applicationNumber: application.applicationNumber,
      customerName: application.customer.fullName,
      customerPan: application.customer.pan,
      customerEmail: application.customer.email,
      customerPhone: application.customer.phone,
      loanAmount: Number(application.requestedAmount),
      interestRate: Number(application.product.interestRate),
      tenureMonths: application.tenureMonths,
      loanProductId: application.productId,
      status: application.status,
      collateralValue: totalCollateralValue,
      currentLtv: (Number(application.requestedAmount) / totalCollateralValue) * 100,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt
    }
    
    return NextResponse.json(transformedApplication, { status: 201 })
  } catch (error) {
    console.error("Failed to create loan application:", error)
    
    // Handle Prisma unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      if (error.message.includes('email')) {
        return NextResponse.json({ error: "A customer with this email already exists" }, { status: 400 })
      }
      if (error.message.includes('pan')) {
        return NextResponse.json({ error: "A customer with this PAN already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: "Duplicate data found. Please check your information." }, { status: 400 })
    }
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to create loan application" }, { status: 500 })
  }
}