# Smart Spend API Documentation

## Base URL
`http://localhost:8000`

## Authentication
Currently using mock authentication. Real JWT-based auth to be implemented.

---

## User & Profile Endpoints

### GET /profile
Get current user profile information.

**Response:**
```json
{
  "id": "1",
  "name": "Milton Raj",
  "email": "milton.raj@example.com",
  "phone": "+91 98765 43210",
  "profile_image": null,
  "member_since": "2024-01-01T00:00:00",
  "dob": "1995-08-15",
  "monthly_income": 50000.0,
  "is_premium_member": false
}
```

### PUT /profile
Update user profile information.

**Request Body:**
```json
{
  "name": "Milton Raj",
  "email": "milton.raj@example.com",
  "phone": "+91 98765 43210",
  "dob": "1995-08-15",
  "monthly_income": 50000.0
}
```

### POST /profile/image
Upload profile image.

**Query Parameters:**
- `image_url`: URL of the image

**Response:**
```json
{
  "status": "success",
  "image_url": "https://example.com/image.jpg"
}
```

---

## Transaction Endpoints

### POST /parse-sms
Parse SMS transaction data.

**Request Body:**
```json
{
  "sender": "HDFCBK",
  "body": "Your account has been debited by Rs 500 at Starbucks",
  "timestamp": 1234567890
}
```

**Response:**
```json
{
  "amount": 500.0,
  "merchant": "Starbucks",
  "category": "Food & Dining",
  "date": "2024-01-01T12:00:00",
  "type": "debit",
  "is_leak": false
}
```

### POST /transactions
Create a new transaction.

**Request Body:**
```json
{
  "amount": 500.0,
  "merchant": "Starbucks",
  "category": "Food & Dining",
  "date": "2024-01-01T12:00:00",
  "type": "debit"
}
```

---

## Payment & Premium Endpoints

### POST /payment/initiate
Initiate a premium membership payment.

**Response:**
```json
{
  "order_id": "order_abc123",
  "amount": 50000,
  "currency": "INR",
  "receipt": "receipt_xyz",
  "status": "created"
}
```

### POST /payment/verify
Verify Razorpay payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": "order_abc123",
  "razorpay_payment_id": "pay_xyz",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "is_premium": true
}
```

### GET /profile/premium-status
Check premium membership status.

**Response:**
```json
{
  "is_premium": false,
  "membership_type": "free"
}
```

### POST /profile/upgrade-membership
Upgrade to premium membership.

**Response:**
```json
{
  "status": "success",
  "message": "Membership upgraded"
}
```

---

## Payment Methods Endpoints

### GET /payment-methods
Get all saved payment methods.

**Response:**
```json
[
  {
    "id": "pm_1",
    "user_id": "user_123",
    "type": "upi",
    "identifier": "milton@okhdfcbank",
    "name": "Google Pay"
  }
]
```

### POST /payment-methods
Add a new payment method.

**Request Body:**
```json
{
  "type": "upi",
  "identifier": "milton@okhdfcbank",
  "name": "Google Pay"
}
```

### DELETE /payment-methods/{pm_id}
Delete a payment method.

**Response:**
```json
{
  "status": "success"
}
```

---

## Suggestions Endpoint

### GET /suggestions/{category}
Get spending suggestions for a category.

**Response:**
```json
{
  "suggestion": "Consider reducing spending in this category"
}
```

---

## Database Schema

### Users Table
- `id`: INTEGER (Primary Key)
- `email`: TEXT (Unique)
- `password_hash`: TEXT
- `full_name`: TEXT
- `monthly_income`: REAL
- `currency`: TEXT
- `created_at`: DATETIME
- `updated_at`: DATETIME

### Categories Table
- `id`: INTEGER (Primary Key)
- `name`: TEXT
- `type`: TEXT (income/expense)
- `icon`: TEXT
- `color`: TEXT
- `is_default`: BOOLEAN
- `user_id`: INTEGER (Foreign Key)

### Transactions Table
- `id`: INTEGER (Primary Key)
- `user_id`: INTEGER (Foreign Key)
- `amount`: REAL
- `category_id`: INTEGER (Foreign Key)
- `note`: TEXT
- `date`: DATETIME
- `type`: TEXT (income/expense)
- `created_at`: DATETIME

### Budgets Table
- `id`: INTEGER (Primary Key)
- `user_id`: INTEGER (Foreign Key)
- `category_id`: INTEGER (Foreign Key)
- `amount`: REAL
- `period`: TEXT (monthly/weekly/yearly)
- `start_date`: DATE
- `end_date`: DATE
- `created_at`: DATETIME

### Goals Table
- `id`: INTEGER (Primary Key)
- `user_id`: INTEGER (Foreign Key)
- `name`: TEXT
- `target_amount`: REAL
- `current_amount`: REAL
- `deadline`: DATE
- `icon`: TEXT
- `color`: TEXT
- `created_at`: DATETIME

---

## Running the Backend

1. Navigate to Backend directory:
```bash
cd Backend
```

2. Activate virtual environment:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. Access API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
