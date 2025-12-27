import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { collaterals } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// GET single collateral by ID
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [collateral] = await db.select().from(collaterals).where(eq(collaterals.id, id))
    if (!collateral) {
      return NextResponse.json({ error: "Collateral not found" }, { status: 404 })
    }
    return NextResponse.json(collateral)
  } catch (error) {
    console.error("Failed to fetch collateral:", error)
    return NextResponse.json({ error: "Failed to fetch collateral" }, { status: 500 })
  }
}

// PUT update collateral (e.g., update NAV, lien status)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const [collateral] = await db
      .update(collaterals)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(collaterals.id, id))
      .returning()
    if (!collateral) {
      return NextResponse.json({ error: "Collateral not found" }, { status: 404 })
    }
    return NextResponse.json(collateral)
  } catch (error) {
    console.error("Failed to update collateral:", error)
    return NextResponse.json({ error: "Failed to update collateral" }, { status: 500 })
  }
}

// DELETE collateral
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.delete(collaterals).where(eq(collaterals.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete collateral:", error)
    return NextResponse.json({ error: "Failed to delete collateral" }, { status: 500 })
  }
}
