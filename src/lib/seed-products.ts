import { prisma } from "@/lib/prisma"

export async function seedLoanProducts() {
  const existingProducts = await prisma.loanProduct.count()
  
  if (existingProducts > 0) {
    console.log(`Loan products already exist: ${existingProducts}`)
    return
  }

  const loanProducts = [
    {
      name: "Equity Mutual Fund Loan",
      description: "Loan against equity mutual funds with competitive rates",
      minAmount: 100000,
      maxAmount: 10000000,
      interestRate: 10.5,
      ltvRatio: 50,
      minTenureMonths: 6,
      maxTenureMonths: 36,
      processingFeePercentage: 1.5,
      isActive: true,
    },
    {
      name: "Debt Mutual Fund Loan", 
      description: "Loan against debt mutual funds with lower interest rates",
      minAmount: 50000,
      maxAmount: 5000000,
      interestRate: 9.5,
      ltvRatio: 75,
      minTenureMonths: 3,
      maxTenureMonths: 24,
      processingFeePercentage: 1.0,
      isActive: true,
    },
    {
      name: "Hybrid Fund Loan",
      description: "Loan against hybrid mutual funds with balanced risk",
      minAmount: 200000,
      maxAmount: 7500000,
      interestRate: 11.0,
      ltvRatio: 60,
      minTenureMonths: 6,
      maxTenureMonths: 30,
      processingFeePercentage: 1.25,
      isActive: true,
    }
  ]

  try {
    for (const product of loanProducts) {
      await prisma.loanProduct.create({
        data: product
      })
    }
    console.log('Loan products seeded successfully!')
  } catch (error) {
    console.error('Error seeding loan products:', error)
  }
}