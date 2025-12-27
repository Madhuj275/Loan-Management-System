import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all ongoing loans with related data
export async function GET() {
  try {
    const ongoingLoans = await prisma.loan.findMany({
      where: {
        status: "active"
      },
      include: {
        customer: true,
        product: true,
        collaterals: true,
        transactions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(ongoingLoans)
  } catch (error) {
    console.error("Failed to fetch ongoing loans:", error)
    return NextResponse.json({ error: "Failed to fetch ongoing loans" }, { status: 500 })
  }
}

// POST create new loan (disburse approved application)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Generate unique loan number
    const loanNumber = `LN${Date.now()}${Math.floor(Math.random() * 1000)}`
    
    const loan = await prisma.loan.create({
      data: {
        loanNumber,
        applicationId: body.applicationId,
        customerId: body.customerId,
        productId: body.productId,
        sanctionedAmount: body.sanctionedAmount,
        outstandingPrincipal: body.sanctionedAmount,
        outstandingInterest: 0,
        interestRate: body.interestRate,
        tenureMonths: body.tenureMonths,
        disbursedAt: new Date(),
        maturityDate: body.maturityDate,
        status: "active",
      }
    })

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    console.error("Failed to create loan:", error)
    return NextResponse.json({ error: "Failed to create loan" }, { status: 500 })
  }
}