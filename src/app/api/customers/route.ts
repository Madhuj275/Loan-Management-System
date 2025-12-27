import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all customers
export async function GET() {
  try {
    const allCustomers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(allCustomers)
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

// POST create new customer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const customer = await prisma.customer.create({
      data: {
        ...body,
        updatedAt: new Date(),
      }
    })
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Failed to create customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}