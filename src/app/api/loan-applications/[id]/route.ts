import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { loanApplications, collaterals } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// GET single loan application by ID
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [application] = await db.select().from(loanApplications).where(eq(loanApplications.id, id))
    if (!application) {
      return NextResponse.json({ error: "Loan application not found" }, { status: 404 })
    }

    // Fetch collaterals
    const appCollaterals = await db.select().from(collaterals).where(eq(collaterals.loanApplicationId, id))

    return NextResponse.json({ ...application, collaterals: appCollaterals })
  } catch (error) {
    console.error("Failed to fetch loan application:", error)
    return NextResponse.json({ error: "Failed to fetch loan application" }, { status: 500 })
  }
}

// PUT update loan application by ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const [application] = await db
      .update(loanApplications)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(loanApplications.id, id))
      .returning()
    if (!application) {
      return NextResponse.json({ error: "Loan application not found" }, { status: 404 })
    }
    return NextResponse.json(application)
  } catch (error) {
    console.error("Failed to update loan application:", error)
    return NextResponse.json({ error: "Failed to update loan application" }, { status: 500 })
  }
}
