const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface LoanProduct {
  id: string
  name: string
  description?: string
  interestRate: number
  maxAmount: number
  minAmount: number
  maxTenureMonths: number
  minTenureMonths: number
  ltvRatio: number
  processingFeePercentage: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoanApplication {
  id: string
  applicationNumber: string
  customerName: string
  customerPan: string
  customerEmail: string
  customerPhone: string
  loanAmount: number
  interestRate: number
  tenureMonths: number
  loanProductId: string
  loanProductName?: string
  status: "draft" | "pending" | "approved" | "rejected" | "disbursed"
  collateralValue: number
  currentLtv: number
  createdAt: Date
  updatedAt: Date
}

export interface Collateral {
  id: string
  loanApplicationId: string
  fundName: string
  isin: string
  amcName: string
  folioNumber: string
  unitsPledged: number
  currentNav: number
  currentValue: number
  lienStatus: "pending" | "marked" | "released"
  lienMarkedAt: Date | null
  lienReference: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OngoingLoan {
  id: string
  loanApplicationId: string
  loanNumber: string
  customerName: string
  customerPan: string
  loanAmount: number
  outstandingPrincipal: number
  outstandingInterest: number
  interestRate: number
  tenureMonths: number
  monthsRemaining: number
  disbursedDate: Date
  maturityDate: Date
  status: "active" | "margin_call" | "closed" | "defaulted"
  collateralValue: number
  currentLtv: number
  lastPaymentDate: Date
  emiAmount: number
  createdAt: Date
  updatedAt: Date
}

class LMSService {
  private async fetchAPI(endpoint: string, options?: RequestInit) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error ${response.status}:`, errorText)
        throw new Error(`API call failed: ${response.status} - ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error calling API ${endpoint}:`, error)
      throw error
    }
  }

  // Loan Products
  async getLoanProducts(): Promise<LoanProduct[]> {
    return this.fetchAPI('/loan-products')
  }

  async createLoanProduct(data: Omit<LoanProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoanProduct> {
    return this.fetchAPI('/loan-products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Loan Applications
  async getLoanApplications(): Promise<LoanApplication[]> {
    return this.fetchAPI('/loan-applications')
  }

  async createLoanApplication(data: {
    customerName: string
    customerPan: string
    customerEmail: string
    customerPhone: string
    loanAmount: number
    tenureMonths: number
    loanProductId: string
    collaterals: Array<{
      fundName: string
      isin: string
      amcName: string
      folioNumber: string
      unitsPledged: number
      currentNav: number
    }>
  }): Promise<LoanApplication> {
    return this.fetchAPI('/loan-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Collaterals
  async getCollaterals(): Promise<Collateral[]> {
    return this.fetchAPI('/collaterals')
  }

  async updateCollateralNav(collateralId: string, newNav: number): Promise<Collateral> {
    return this.fetchAPI(`/collaterals/${collateralId}/nav`, {
      method: 'PUT',
      body: JSON.stringify({ nav: newNav }),
    })
  }

  async markLien(collateralId: string, lienReference: string): Promise<Collateral> {
    return this.fetchAPI(`/collaterals/${collateralId}/lien`, {
      method: 'PUT',
      body: JSON.stringify({ lienReference }),
    })
  }

  async releaseLien(collateralId: string): Promise<Collateral> {
    return this.fetchAPI(`/collaterals/${collateralId}/release`, {
      method: 'PUT',
    })
  }

  // Ongoing Loans
  async getOngoingLoans(): Promise<OngoingLoan[]> {
    return this.fetchAPI('/ongoing-loans')
  }

  async updateLoanStatus(loanId: string, status: string): Promise<OngoingLoan> {
    return this.fetchAPI(`/ongoing-loans/${loanId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async processPayment(loanId: string, amount: number): Promise<OngoingLoan> {
    return this.fetchAPI(`/ongoing-loans/${loanId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  }
}

export const lmsService = new LMSService()