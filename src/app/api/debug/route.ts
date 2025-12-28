import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Check if loan products exist
    const products = await prisma.loanProduct.findMany()
    
    // Check if applications exist
    const applications = await prisma.loanApplication.findMany({
      include: {
        customer: true,
        product: true,
        collaterals: true,
      }
    })

    return NextResponse.json({
      productsCount: products.length,
      applicationsCount: applications.length,
      products: products,
      applications: applications
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}