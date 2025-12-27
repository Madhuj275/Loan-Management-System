# LMS API Documentation for Fintech Integration

## Overview

This API documentation provides details for fintech companies to integrate with our Loan Management System (LMS) for Lending Against Mutual Funds (LAMF).

## Base URL

```
https://your-domain.com/api
```

## Authentication

All API requests require authentication. Include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## API Endpoints

### 1. Loan Products

#### Get All Loan Products
```http
GET /loan-products
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Equity Mutual Fund Loan",
    "description": "Loan against equity mutual funds with competitive rates",
    "interestRate": 10.5,
    "maxLoanAmount": 10000000,
    "minLoanAmount": 100000,
    "maxTenureMonths": 36,
    "minTenureMonths": 6,
    "maxLtvRatio": 50,
    "processingFee": 1.5,
    "eligibilityCriteria": "Equity mutual funds with minimum 1 year track record",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 2. Loan Applications

#### Get All Loan Applications
```http
GET /loan-applications
```

**Response:**
```json
[
  {
    "id": "LAMF20241227001",
    "applicationNumber": "LAMF20241227001",
    "customerName": "Rajesh Kumar",
    "customerPan": "ABCDE1234F",
    "customerEmail": "rajesh.kumar@email.com",
    "customerPhone": "+919876543210",
    "loanAmount": 500000,
    "interestRate": 10.5,
    "tenureMonths": 24,
    "loanProductId": "1",
    "status": "pending",
    "collateralValue": 700000,
    "currentLtv": 71.4,
    "createdAt": "2024-12-27T10:00:00Z",
    "updatedAt": "2024-12-27T10:00:00Z"
  }
]
```

#### Create New Loan Application (Fintech Integration)
```http
POST /loan-applications
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerPan": "ABCDE1234F",
  "customerEmail": "john.doe@email.com",
  "customerPhone": "+919876543210",
  "loanAmount": 500000,
  "tenureMonths": 24,
  "loanProductId": "1",
  "collaterals": [
    {
      "fundName": "HDFC Index Fund - Sensex Plan",
      "isin": "INF179K01TS5",
      "amcName": "HDFC Asset Management Company",
      "folioNumber": "1234567890",
      "unitsPledged": 1000,
      "currentNav": 150.25
    },
    {
      "fundName": "ICICI Prudential Equity Fund",
      "isin": "INF109K01VS2",
      "amcName": "ICICI Prudential Asset Management",
      "folioNumber": "0987654321",
      "unitsPledged": 2000,
      "currentNav": 100.75
    }
  ]
}
```

**Response:**
```json
{
  "id": "LAMF20241227002",
  "applicationNumber": "LAMF20241227002",
  "customerName": "John Doe",
  "customerPan": "ABCDE1234F",
  "customerEmail": "john.doe@email.com",
  "customerPhone": "+919876543210",
  "loanAmount": 500000,
  "interestRate": 10.5,
  "tenureMonths": 24,
  "loanProductId": "1",
  "status": "pending",
  "collateralValue": 351750,
  "currentLtv": 142.2,
  "createdAt": "2024-12-27T12:00:00Z",
  "updatedAt": "2024-12-27T12:00:00Z"
}
```

**Validation Rules:**
- PAN must be valid 10-character alphanumeric
- Email must be valid email format
- Phone must be valid Indian mobile number (+91XXXXXXXXXX)
- Loan amount must be within product min/max limits
- Tenure must be within product min/max limits
- Total collateral value must support requested LTV ratio
- All required fields must be provided

### 3. Collaterals

#### Get All Collaterals
```http
GET /collaterals
```

**Response:**
```json
[
  {
    "id": "COLL20241227001",
    "loanApplicationId": "LAMF20241227001",
    "fundName": "HDFC Index Fund - Sensex Plan",
    "isin": "INF179K01TS5",
    "amcName": "HDFC Asset Management Company",
    "folioNumber": "1234567890",
    "unitsPledged": 1000,
    "currentNav": 150.25,
    "currentValue": 150250,
    "lienStatus": "marked",
    "lienMarkedAt": "2024-12-27T11:00:00Z",
    "lienReference": "CAMS/LIEN/2024/12345",
    "createdAt": "2024-12-27T10:00:00Z",
    "updatedAt": "2024-12-27T11:00:00Z"
  }
]
```

#### Update Collateral NAV
```http
PUT /collaterals/{collateralId}/nav
```

**Request Body:**
```json
{
  "nav": 155.50
}
```

### 4. Ongoing Loans

#### Get All Ongoing Loans
```http
GET /ongoing-loans
```

**Response:**
```json
[
  {
    "id": "LOAN20241227001",
    "loanApplicationId": "LAMF20241227001",
    "loanNumber": "LOAN20241227001",
    "customerName": "Rajesh Kumar",
    "customerPan": "ABCDE1234F",
    "loanAmount": 500000,
    "outstandingPrincipal": 480000,
    "outstandingInterest": 5250,
    "interestRate": 10.5,
    "tenureMonths": 24,
    "monthsRemaining": 22,
    "disbursedDate": "2024-12-27T00:00:00Z",
    "maturityDate": "2026-12-27T00:00:00Z",
    "status": "active",
    "collateralValue": 700000,
    "currentLtv": 68.6,
    "lastPaymentDate": "2024-12-27T00:00:00Z",
    "emiAmount": 23125,
    "createdAt": "2024-12-27T00:00:00Z",
    "updatedAt": "2024-12-27T00:00:00Z"
  }
]
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited:
- 100 requests per minute per API key
- 1000 requests per hour per API key

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks (Optional)

For real-time updates, you can configure webhooks to receive notifications for:
- Loan application status changes
- Payment processing
- Margin call alerts
- Lien status updates

Webhook payload example:
```json
{
  "event": "loan_application.status_changed",
  "data": {
    "applicationId": "LAMF20241227001",
    "oldStatus": "pending",
    "newStatus": "approved",
    "timestamp": "2024-12-27T14:30:00Z"
  },
  "signature": "webhook_signature_for_verification"
}
```

## Testing

Use the sandbox environment for testing:
```
https://sandbox.your-domain.com/api
```

Test data is available for:
- Valid PAN numbers: ABCDE1234F, FGHIJ5678K, LMNOP9012Q
- Valid ISIN codes: INF179K01TS5, INF109K01VS2, INF200K01BT8
- Test mutual fund data with realistic NAV values

## Support

For API support, contact:
- Email: api-support@your-company.com
- Phone: +91-XXXXXXXXXX
- Documentation: https://docs.your-domain.com/api