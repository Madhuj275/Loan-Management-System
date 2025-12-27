import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { collaterals } from "@/lib/db/schema"
import { desc, eq, or } from "drizzle-orm"

// GET all collaterals
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const loanId = searchParams.get("loanId")
    const loanApplicationId = searchParams.get("loanApplicationId")

    let query = db.select().from(collaterals)

    if (loanId || loanApplicationId) {
      const conditions = []
      if (loanId) conditions.push(eq(collaterals.loanId, loanId))
      if (loanApplicationId) conditions.push(eq(collaterals.loanApplicationId, loanApplicationId))
      
      query = query.where(or(...conditions)) as any
    }

    const allCollaterals = await query.orderBy(desc(collaterals.createdAt))
    return NextResponse.json(allCollaterals)
  } catch (error) {
    console.error("Failed to fetch collaterals:", error)
    return NextResponse.json({ error: "Failed to fetch collaterals" }, { status: 500 })
  }
}

// POST create new collateral
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const [collateral] = await db.insert(collaterals).values({
      ...body,
      updatedAt: new Date(),
    }).returning()
    return NextResponse.json(collateral, { status: 201 })
  } catch (error) {
    console.error("Failed to create collateral:", error)
    return NextResponse.json({ error: "Failed to create collateral" }, { status: 500 })
  }
}
