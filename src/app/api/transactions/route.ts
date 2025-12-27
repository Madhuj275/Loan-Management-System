import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { transactions } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

// GET all transactions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const loanId = searchParams.get("loanId")

    let query = db.select().from(transactions)

    if (loanId) {
      query = query.where(eq(transactions.loanId, loanId)) as any
    }

    const allTransactions = await query.orderBy(desc(transactions.createdAt))
    return NextResponse.json(allTransactions)
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

// POST create new transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Generate unique transaction number
    const transactionNumber = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`
    
    const [transaction] = await db.insert(transactions).values({
      transactionNumber,
      loanId: body.loanId,
      type: body.type,
      amount: body.amount,
      description: body.description,
      transactionDate: body.transactionDate || new Date(),
      paymentMethod: body.paymentMethod,
      referenceNumber: body.referenceNumber,
    }).returning()
    
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
