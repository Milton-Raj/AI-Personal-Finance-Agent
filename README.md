# Smart Spend - AI Personal Finance Manager

A comprehensive mobile application for intelligent personal finance management with AI-powered insights.

## 🚀 Features

- **Smart Onboarding**: Beautiful splash screen, authentication flow, and personalized setup
- **Transaction Tracking**: Automatic SMS parsing and categorization
- **Budget Management**: Set and track budgets by category
- **Financial Goals**: Create and monitor savings goals
- **Premium Membership**: Unlock advanced features with premium subscription
- **AI Insights**: Get intelligent spending suggestions and leak detection

## 📁 Project Structure

```
AI Personal Finance/
├── mobile-app/           # React Native (Expo) mobile application
├── Backend/              # FastAPI backend server
├── App Database/         # SQLite database files
│   ├── schema.sql       # Database schema
│   └── smart_spend.db   # SQLite database file
├── init_db.py           # Database initialization script
├── test_db.py           # Database test script
└── API_DOCUMENTATION.md # API endpoints documentation
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- Expo CLI
- SQLite

### Mobile App Setup

1. Navigate to mobile app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
- Scan QR code with Expo Go app (iOS/Android)
- Or press `i` for iOS simulator
- Or press `a` for Android emulator

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database (from project root):
```bash
python3 init_db.py
```

5. Test database connection:
```bash
python3 test_db.py
```

6. Start the backend server:
```bash
cd Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

7. Access API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Update Mobile App Config

Update the API URL in `mobile-app/src/config.js`:
```javascript
export const API_URL = 'http://YOUR_LOCAL_IP:8000';
```

## 📱 App Flow

1. **Splash Screen** → Animated "Smart Spend" logo (2.5s)
2. **Login/Register** → Dummy authentication (for now)
3. **Personal Information** → Collect DOB and monthly income
4. **Home Screen** → Dashboard with financial overview
5. **Premium Upgrade** → Unlock advanced features with celebration confetti

## 🗄️ Database Schema

### Tables
- **users**: User accounts and profile information
- **categories**: Income/expense categories
- **transactions**: Financial transactions
- **budgets**: Budget tracking by category
- **goals**: Savings goals

See `App Database/schema.sql` for complete schema.

## 🔌 API Endpoints

See `API_DOCUMENTATION.md` for complete API reference.

Key endpoints:
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /transactions` - Create transaction
- `POST /payment/initiate` - Start premium payment
- `POST /payment/verify` - Verify payment

## 🎨 Tech Stack

### Mobile App
- React Native (Expo SDK 54)
- React Navigation
- Expo Linear Gradient
- React Native Confetti Cannon
- DateTimePicker

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

## 📝 Development Notes

### Current Status
- ✅ Mobile app UI/UX complete
- ✅ Onboarding flow implemented
- ✅ Database schema created
- ✅ Backend API structure ready
- ⏳ Real authentication pending
- ⏳ Payment gateway integration (Razorpay) pending
- ⏳ AI insights implementation pending

### Next Steps
1. Implement JWT-based authentication
2. Connect mobile app to backend APIs
3. Implement real Razorpay payment flow
4. Add AI-powered spending insights
5. Implement transaction history UI
6. Add budget and goals management screens

## 🤝 Contributing

This is a personal project. For major changes, please open an issue first.

## 📄 License

Private project - All rights reserved

## 👤 Author

Milton Raj

---

**Smart Spend** - Making personal finance management intelligent and effortless.
