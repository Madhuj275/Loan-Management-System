# Loan Management System (LMS)

A comprehensive web application for managing loan products, applications, and customer data with mutual fund collateral support.

## 🚀 Setup and Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- PostgreSQL database (Neon.tech hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with:
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_Ts4KZfrOb3Wl@ep-shiny-block-adq81ttt-pooler.c-2.us-east-1.aws.neon.tech/ai_support_db?sslmode=require
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (for development)
   npm run db:push
   
   # Or create a migration (for production)
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Management

- **Prisma Studio**: Visual database editor
  ```bash
  npm run db:studio
  ```

- **Type checking**: Run TypeScript type checking
  ```bash
  npm run typecheck
  ```

## 📚 API Endpoints and Example Responses

### Loan Products

#### Get All Loan Products
```http
GET /api/loan-products
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Equity Mutual Fund Loan",
    "description": "Loan against equity mutual funds",
    "minAmount": 50000,
    "maxAmount": 5000000,
    "interestRate": 10.5,
    "ltvRatio": 50,
    "minTenureMonths": 12,
    "maxTenureMonths": 60,
    "processingFeePercentage": 1.5,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Loan Product
```http
POST /api/loan-products
```

**Request Body:**
```json
{
  "name": "Debt Mutual Fund Loan",
  "description": "Loan against debt mutual funds",
  "minAmount": 25000,
  "maxAmount": 2500000,
  "interestRate": 9.5,
  "ltvRatio": 75,
  "minTenureMonths": 6,
  "maxTenureMonths": 36,
  "processingFeePercentage": 1.0
}
```

### Loan Applications

#### Get All Applications
```http
GET /api/loan-applications
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "applicationNumber": "APP-2024-0001",
    "customerId": "123e4567-e89b-12d3-a456-426614174002",
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "requestedAmount": 100000,
    "tenureMonths": 24,
    "status": "pending",
    "appliedAt": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-15T09:30:00.000Z"
  }
]
```

#### Create Loan Application
```http
POST /api/loan-applications
```

**Request Body:**
```json
{
  "customerId": "123e4567-e89b-12d3-a456-426614174002",
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "requestedAmount": 150000,
  "tenureMonths": 36
}
```

### Customers

#### Get All Customers
```http
GET /api/customers
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "pan": "ABCDE1234F",
    "aadhaar": "1234-5678-9012",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+91-9876543210",
    "address": "123 Main Street, Mumbai",
    "bankAccountNumber": "1234567890",
    "bankIfsc": "BANK0001234",
    "bankName": "Example Bank",
    "kycVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Customer
```http
POST /api/customers
```

**Request Body:**
```json
{
  "pan": "XYZAB1234C",
  "aadhaar": "9876-5432-1098",
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+91-9123456789",
  "address": "456 Park Avenue, Delhi"
}
```

### Loans

#### Get All Loans
```http
GET /api/loans
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "loanNumber": "LOAN-2024-0001",
    "applicationId": "123e4567-e89b-12d3-a456-426614174001",
    "customerId": "123e4567-e89b-12d3-a456-426614174002",
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "sanctionedAmount": 100000,
    "outstandingPrincipal": 95000,
    "outstandingInterest": 2500,
    "interestRate": 10.5,
    "tenureMonths": 24,
    "disbursedAt": "2024-01-20T00:00:00.000Z",
    "maturityDate": "2026-01-20T00:00:00.000Z",
    "status": "active",
    "createdAt": "2024-01-20T00:00:00.000Z"
  }
]
```

### Collaterals

#### Get All Collaterals
```http
GET /api/collaterals
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "loanApplicationId": "123e4567-e89b-12d3-a456-426614174001",
    "loanId": "123e4567-e89b-12d3-a456-426614174003",
    "fundName": "Nifty 50 Index Fund",
    "isin": "INF209K01W62",
    "amcName": "HDFC Mutual Fund",
    "folioNumber": "123456789",
    "unitsPledged": 1000.50,
    "currentNav": 150.25,
    "currentValue": 150325.13,
    "lienStatus": "marked",
    "lienMarkedAt": "2024-01-15T10:00:00.000Z",
    "lienReference": "LIEN-2024-0001",
    "createdAt": "2024-01-15T09:30:00.000Z"
  }
]
```

### Transactions

#### Get All Transactions
```http
GET /api/transactions
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "transactionNumber": "TXN-2024-0001",
    "loanId": "123e4567-e89b-12d3-a456-426614174003",
    "type": "disbursement",
    "amount": 100000,
    "description": "Loan disbursement",
    "transactionDate": "2024-01-20T00:00:00.000Z",
    "paymentMethod": "neft",
    "referenceNumber": "NEFT-2024-0001",
    "createdAt": "2024-01-20T00:00:00.000Z"
  }
]
```

## 🛠 Tech Stack Used

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Modern ORM for database operations
- **PostgreSQL** - Primary database (hosted on Neon.tech)
- **Neon Database Serverless** - Serverless PostgreSQL

### Development Tools
- **Bun** - Fast package manager and runtime
- **TypeScript** - Type checking and IntelliSense
- **ESLint** - Code linting
- **Prettier** - Code formatting

### UI Components
- **Custom UI Components** - Built with Radix UI and Tailwind
- **Shadcn/ui** - Modern UI component library
- **React Toast** - Toast notifications
- **Sonner** - Enhanced toast notifications

## 📊 Database Schema

### Core Entities

#### 1. Loan Products (`loan_products`)
Stores different types of loan products available in the system.

```prisma
model LoanProduct {
  id                      String    @id @default(uuid())
  name                    String
  description             String?
  minAmount               Decimal   @db.Decimal(15, 2)
  maxAmount               Decimal   @db.Decimal(15, 2)
  interestRate            Decimal   @db.Decimal(5, 2)
  ltvRatio                Decimal   @db.Decimal(5, 2)    // Loan-to-value ratio
  minTenureMonths         Int
  maxTenureMonths         Int
  processingFeePercentage Decimal   @db.Decimal(5, 2)
  isActive                Boolean   @default(true)
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}
```

#### 2. Customers (`customers`)
Stores customer information and KYC details.

```prisma
model Customer {
  id                String   @id @default(uuid())
  pan               String   @unique
  aadhaar           String?
  fullName          String
  email             String   @unique
  phone             String
  address           String?
  bankAccountNumber String?
  bankIfsc          String?
  bankName          String?
  kycVerified       Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

#### 3. Loan Applications (`loan_applications`)
Tracks loan applications from customers.

```prisma
model LoanApplication {
  id                String    @id @default(uuid())
  applicationNumber String    @unique
  customerId        String
  productId         String
  requestedAmount   Decimal   @db.Decimal(15, 2)
  tenureMonths      Int
  status            String    @default("draft")
  rejectionReason   String?
  appliedAt         DateTime?
  approvedAt        DateTime?
  rejectedAt        DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### 4. Loans (`loans`)
Active and historical loan records.

```prisma
model Loan {
  id                  String    @id @default(uuid())
  loanNumber          String    @unique
  applicationId       String    @unique
  customerId          String
  productId           String
  sanctionedAmount    Decimal   @db.Decimal(15, 2)
  outstandingPrincipal Decimal  @db.Decimal(15, 2)
  outstandingInterest Decimal   @db.Decimal(15, 2) @default(0)
  interestRate        Decimal   @db.Decimal(5, 2)
  tenureMonths        Int
  disbursedAt         DateTime?
  maturityDate        DateTime?
  status              String    @default("active")
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}
```

#### 5. Collaterals (`collaterals`)
Mutual fund units pledged as collateral.

```prisma
model Collateral {
  id                String    @id @default(uuid())
  loanApplicationId String?
  loanId            String?
  fundName          String
  isin              String    // International Securities Identification Number
  amcName           String    // Asset Management Company
  folioNumber       String
  unitsPledged      Decimal   @db.Decimal(15, 4)
  currentNav        Decimal   @db.Decimal(10, 2)
  currentValue      Decimal   @db.Decimal(15, 2)
  lienStatus        String    @default("pending")
  lienMarkedAt      DateTime?
  lienReference     String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### 6. Transactions (`transactions`)
Financial transactions related to loans.

```prisma
model Transaction {
  id              String    @id @default(uuid())
  transactionNumber String  @unique
  loanId          String
  type            String    // disbursement, principal_repayment, interest_payment
  amount          Decimal   @db.Decimal(15, 2)
  description     String?
  transactionDate DateTime
  paymentMethod   String?
  referenceNumber String?
  createdAt       DateTime  @default(now())
}
```

#### 7. Margin Calls (`margin_calls`)
Margin call alerts for collateral shortfall.

```prisma
model MarginCall {
  id              String    @id @default(uuid())
  loanId          String
  callNumber      String    @unique
  collateralValue Decimal   @db.Decimal(15, 2)
  requiredLtv     Decimal   @db.Decimal(5, 2)
  currentLtv      Decimal   @db.Decimal(5, 2)
  shortfallAmount Decimal   @db.Decimal(15, 2)
  dueDate         DateTime
  status          String    @default("pending")
  resolvedAt      DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### Relationships

- **LoanProduct** → **LoanApplication** (One-to-Many)
- **LoanProduct** → **Loan** (One-to-Many)
- **Customer** → **LoanApplication** (One-to-Many)
- **Customer** → **Loan** (One-to-Many)
- **LoanApplication** → **Loan** (One-to-One)
- **LoanApplication** → **Collateral** (One-to-Many)
- **Loan** → **Collateral** (One-to-Many)
- **Loan** → **Transaction** (One-to-Many)
- **Loan** → **MarginCall** (One-to-Many)

## 🔐 Security Features

- **Input Validation** - Zod schemas for all API endpoints
- **Type Safety** - Full TypeScript implementation
- **Database Security** - Parameterized queries via Prisma
- **Environment Variables** - Sensitive data in environment variables
- **CORS Protection** - Configured for production deployment

## 📱 Application Features

### Loan Management
- Create and manage loan products
- Process loan applications with workflow states
- Track loan disbursements and repayments
- Monitor loan status and performance

### Customer Management
- Customer onboarding with KYC verification
- PAN and Aadhaar integration
- Bank account details management
- Contact information tracking

### Collateral Management
- Mutual fund unit pledging
- ISIN-based security identification
- Lien marking and release
- Real-time NAV updates
- Margin call monitoring

### Transaction Processing
- Disbursement tracking
- Repayment processing
- Interest calculation
- Payment method integration

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
DATABASE_URL=your_production_database_url
NODE_ENV=production
```

## 📞 Support

For technical support or questions:
- Check the API documentation in `/api/*` routes
- Review the database schema in `prisma/schema.prisma`
- Examine the UI components in the `src/components` directory

## 📄 License

This project is proprietary software. All rights reserved.