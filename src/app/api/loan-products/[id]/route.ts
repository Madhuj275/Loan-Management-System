import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { loanProducts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// GET single loan product by ID
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [product] = await db.select().from(loanProducts).where(eq(loanProducts.id, id))
    if (!product) {
      return NextResponse.json({ error: "Loan product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to fetch loan product:", error)
    return NextResponse.json({ error: "Failed to fetch loan product" }, { status: 500 })
  }
}

// PUT update loan product by ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const [product] = await db
      .update(loanProducts)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(loanProducts.id, id))
      .returning()
    if (!product) {
      return NextResponse.json({ error: "Loan product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to update loan product:", error)
    return NextResponse.json({ error: "Failed to update loan product" }, { status: 500 })
  }
}

// DELETE loan product by ID
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.delete(loanProducts).where(eq(loanProducts.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete loan product:", error)
    return NextResponse.json({ error: "Failed to delete loan product" }, { status: 500 })
  }
}
