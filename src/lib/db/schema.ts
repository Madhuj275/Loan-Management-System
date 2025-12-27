import { pgTable, uuid, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Loan Products Table
export const loanProducts = pgTable("loan_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  minAmount: numeric("min_amount", { precision: 15, scale: 2 }).notNull(),
  maxAmount: numeric("max_amount", { precision: 15, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).notNull(), // Annual interest rate
  ltvRatio: numeric("ltv_ratio", { precision: 5, scale: 2 }).notNull(), // Loan-to-value ratio (e.g., 50% for equity, 75% for debt)
  minTenureMonths: integer("min_tenure_months").notNull(),
  maxTenureMonths: integer("max_tenure_months").notNull(),
  processingFeePercentage: numeric("processing_fee_percentage", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Customers Table
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  pan: text("pan").notNull().unique(),
  aadhaar: text("aadhaar"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address"),
  bankAccountNumber: text("bank_account_number"),
  bankIfsc: text("bank_ifsc"),
  bankName: text("bank_name"),
  kycVerified: boolean("kyc_verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Loan Applications Table
export const loanApplications = pgTable("loan_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  productId: uuid("product_id").notNull().references(() => loanProducts.id),
  requestedAmount: numeric("requested_amount", { precision: 15, scale: 2 }).notNull(),
  tenureMonths: integer("tenure_months").notNull(),
  status: text("status").notNull().default("draft"), // draft, pending, approved, rejected, disbursed
  rejectionReason: text("rejection_reason"),
  appliedAt: timestamp("applied_at"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Loans Table (Active/Ongoing Loans)
export const loans = pgTable("loans", {
  id: uuid("id").defaultRandom().primaryKey(),
  loanNumber: text("loan_number").notNull().unique(),
  applicationId: uuid("application_id").notNull().references(() => loanApplications.id),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  productId: uuid("product_id").notNull().references(() => loanProducts.id),
  sanctionedAmount: numeric("sanctioned_amount", { precision: 15, scale: 2 }).notNull(),
  outstandingPrincipal: numeric("outstanding_principal", { precision: 15, scale: 2 }).notNull(),
  outstandingInterest: numeric("outstanding_interest", { precision: 15, scale: 2 }).notNull().default("0"),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).notNull(),
  tenureMonths: integer("tenure_months").notNull(),
  disbursedAt: timestamp("disbursed_at"),
  maturityDate: timestamp("maturity_date"),
  status: text("status").notNull().default("active"), // active, closed, defaulted
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Collaterals Table (Mutual Fund Units)
export const collaterals = pgTable("collaterals", {
  id: uuid("id").defaultRandom().primaryKey(),
  loanApplicationId: uuid("loan_application_id").references(() => loanApplications.id),
  loanId: uuid("loan_id").references(() => loans.id),
  fundName: text("fund_name").notNull(),
  isin: text("isin").notNull(), // International Securities Identification Number
  amcName: text("amc_name").notNull(), // Asset Management Company
  folioNumber: text("folio_number").notNull(),
  unitsPledged: numeric("units_pledged", { precision: 15, scale: 4 }).notNull(),
  currentNav: numeric("current_nav", { precision: 10, scale: 2 }).notNull(), // Net Asset Value
  currentValue: numeric("current_value", { precision: 15, scale: 2 }).notNull(),
  lienStatus: text("lien_status").notNull().default("pending"), // pending, marked, released
  lienMarkedAt: timestamp("lien_marked_at"),
  lienReference: text("lien_reference"), // Reference from CAMS/KFintech
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Transactions Table
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionNumber: text("transaction_number").notNull().unique(),
  loanId: uuid("loan_id").notNull().references(() => loans.id),
  type: text("type").notNull(), // disbursement, principal_repayment, interest_payment
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  transactionDate: timestamp("transaction_date").notNull(),
  paymentMethod: text("payment_method"), // upi, neft, rtgs, etc.
  referenceNumber: text("reference_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Margin Calls Table
export const marginCalls = pgTable("margin_calls", {
  id: uuid("id").defaultRandom().primaryKey(),
  loanId: uuid("loan_id").notNull().references(() => loans.id),
  callNumber: text("call_number").notNull().unique(),
  collateralValue: numeric("collateral_value", { precision: 15, scale: 2 }).notNull(),
  requiredLtv: numeric("required_ltv", { precision: 5, scale: 2 }).notNull(),
  currentLtv: numeric("current_ltv", { precision: 5, scale: 2 }).notNull(),
  shortfallAmount: numeric("shortfall_amount", { precision: 15, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, resolved, defaulted
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Relations
export const loanProductsRelations = relations(loanProducts, ({ many }) => ({
  applications: many(loanApplications),
  loans: many(loans),
}))

export const customersRelations = relations(customers, ({ many }) => ({
  applications: many(loanApplications),
  loans: many(loans),
}))

export const loanApplicationsRelations = relations(loanApplications, ({ one, many }) => ({
  customer: one(customers, {
    fields: [loanApplications.customerId],
    references: [customers.id],
  }),
  product: one(loanProducts, {
    fields: [loanApplications.productId],
    references: [loanProducts.id],
  }),
  collaterals: many(collaterals),
  loan: one(loans, {
    fields: [loanApplications.id],
    references: [loans.applicationId],
  }),
}))

export const loansRelations = relations(loans, ({ one, many }) => ({
  application: one(loanApplications, {
    fields: [loans.applicationId],
    references: [loanApplications.id],
  }),
  customer: one(customers, {
    fields: [loans.customerId],
    references: [customers.id],
  }),
  product: one(loanProducts, {
    fields: [loans.productId],
    references: [loanProducts.id],
  }),
  collaterals: many(collaterals),
  transactions: many(transactions),
  marginCalls: many(marginCalls),
}))

export const collateralsRelations = relations(collaterals, ({ one }) => ({
  loanApplication: one(loanApplications, {
    fields: [collaterals.loanApplicationId],
    references: [loanApplications.id],
  }),
  loan: one(loans, {
    fields: [collaterals.loanId],
    references: [loans.id],
  }),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  loan: one(loans, {
    fields: [transactions.loanId],
    references: [loans.id],
  }),
}))

export const marginCallsRelations = relations(marginCalls, ({ one }) => ({
  loan: one(loans, {
    fields: [marginCalls.loanId],
    references: [loans.id],
  }),
}))

// Type exports for TypeScript
export type LoanProduct = typeof loanProducts.$inferSelect
export type NewLoanProduct = typeof loanProducts.$inferInsert

export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert

export type LoanApplication = typeof loanApplications.$inferSelect
export type NewLoanApplication = typeof loanApplications.$inferInsert

export type Loan = typeof loans.$inferSelect
export type NewLoan = typeof loans.$inferInsert

export type Collateral = typeof collaterals.$inferSelect
export type NewCollateral = typeof collaterals.$inferInsert

export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert

export type MarginCall = typeof marginCalls.$inferSelect
export type NewMarginCall = typeof marginCalls.$inferInsert
