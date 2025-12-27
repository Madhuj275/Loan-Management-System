import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all loan products
export async function GET() {
  try {
    const products = await prisma.loanProduct.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products)
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